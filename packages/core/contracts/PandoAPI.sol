pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "./Pando.sol";
import "./PandoHistory.sol";
import "./PandoLineage.sol";


// Public function are abstract
// actual implementations refers to internal methods like _sort _ valuate, etc. which actually enforces state machine checks
// The pando interface version is tied to the library which can be deployed only once;
// If I send for instance a valuate RFL to a voting app the app must be aware of the internal logic like: to execute it it need to know that RFL are accepted.
// So the voting app needs to have access to the internal state of the Kit. The best idea is to actually turn kit into decision engine which can be aware of the state of the kit.

// Pando app: three smart contracts on top of which one can build actual apps thorugh the exposed API of the PandoEngine contract. The PandoEngine is the source of thrust storing state and enforcing basic stuff about how that state can be modified

// The PandoLineage and PandoHistory permissions are set one for all and can't be modified. Only the PandoEngine can access it. This is set at DAO deployement and cannot be changed.

// This apps built on top of the pandoengine contract are supposed to propose governance and stuff and map between the state of the engine and the apps (for instance map a RFI id with a vote ID). They fetch data from the Engine and transact to the engine (Necessity to extend the sandboxing policy)

// For instance a dictator kit will have an auth(DICTATOR_ROLE) for function call

// It's this kit which are actually work as app in the AragonFrontEnd

// It's up to the kit to define more fine-grained stuff - such as the requirement for staking and all - on top of PandoEngine API. Thes kits you wanna be used by tge must just enfoce a minimum API to provide CLI interoperability with different KITs

// All the apps need to rely on the same version of the pando library defining shared data structures and helpers function on top of these datastructures;

// The kits have no direct access neither to the lineage token nor to the history graph - thanks to the ACL and role enforcement. The only way for kits to update token and history is to go trhough the PandoEngine API.


contract PandoAPI is AragonApp {
    using Pando for Pando.Individuation;
    using Pando for Pando.RFI;
    using Pando for Pando.RFL;

    bytes32 constant public CREATE_RFI_ROLE  = keccak256("CREATE_RFI_ROLE");
    bytes32 constant public SORT_RFI_ROLE    = keccak256("SORT_RFI_ROLE");
    bytes32 constant public CREATE_RFL_ROLE  = keccak256("CREATE_RFL_ROLE");
    bytes32 constant public VALUATE_RFL_ROLE = keccak256("VALUATE_RFL_ROLE"); // RENAME VALUATE AS ACCEPT
    bytes32 constant public REJECT_RFL_ROLE  = keccak256("REJECT_RFL_ROLE");

    event CreateRFI(uint256 id);
    event CreateRFL(uint256 id);
    event SortRFI(uint256 id, Pando.RFISorting sorting);
    event CancelRFI(uint256 id);
    event CancelRFL(uint256 id);
    event ValuateRFL(uint256 id, uint256 amount);
    event RejectRFL(uint256 id);

    event MintRFL(uint256 id, address destination, uint256 amount);

    PandoHistory public history;
    PandoLineage public lineage;

    // Use a mapping instead of an array to ease app upgrade
    // See https://github.com/aragon/aragon-apps/pull/428
    // See https://youtu.be/sJ7VECqHFAg?t=9m27s
    mapping (uint256 => Pando.RFI) internal RFIs;
    mapping (uint256 => Pando.RFL) internal RFLs;

    uint256 public RFIsLength = 0;
    uint256 public RFLsLength = 0;

    /*
    * @group
    *
    * transactions
    * public or external
    */

    function initialize(PandoHistory _history, PandoLineage _lineage) onlyInit external {
        initialized();
        history = _history;
        lineage = _lineage;
    }

    function createRFI(Pando.IIndividuation _individuation, Pando.ILineage[] _lineages) isInitialized auth(CREATE_RFI_ROLE) public returns (uint256 RFIid)  {
        RFIid = _createRFI(_individuation, _lineages);
    }


    // Separate between merge and reject; it's more clear;
    function sortRFI(uint256 _RFIid, Pando.RFISorting _sorting) isInitialized auth(CREATE_RFI_ROLE) public {
        Pando.RFI storage RFI = RFIs[_RFIid];

        require(RFI.isPending());

        if (_sorting == Pando.RFISorting.Merge) {
            for(uint256 i = 0; i < RFI.RFLids.length; i++) {
                require(RFLs[RFI.RFLids[i]].isValuated());
            }
        }

        _sortRFI(_RFIid, _sorting);
    }

    function valuateRFL(uint256 _RFLid, uint256 _amount) isInitialized auth(VALUATE_RFL_ROLE) public {
        Pando.RFL storage RFL = RFLs[_RFLid];

        require(RFL.isPending());
        require(_amount >= RFL.lineage.minimum);

        _valuateRFL(_RFLid, _amount);
    }

    function rejectRFL(uint256 _RFLid) isInitialized auth(REJECT_RFL_ROLE) public {
        Pando.RFL storage RFL = RFLs[_RFLid];

        require(RFL.isPending());

        _rejectRFL(_RFLid);
    }

    /*
    * @group
    *
    * getters
    * public or external
    */

    function getRFI(uint256 _RFIid) public view returns (Pando.RFI) {
        return RFIs[_RFIid];
    }

    function getRFL(uint256 _RFLid) public view returns (Pando.RFL) {
        return RFLs[_RFLid];
    }

    function head() public view returns (bytes32) {
        return history.head();
    }

    function getHead() isInitialized public view returns (Pando.Individuation) {
        return history.getHead();
    }

    function getIndividuationHash(Pando.Individuation _individuation) public pure returns (bytes32) {
        return _individuation.hash();
    }

    /*
    * @group
    *
    * transactions
    * internal
    */

    function _createRFI(Pando.IIndividuation _individuation, Pando.ILineage[] _lineages) internal returns (uint256 RFIid)  {
        // msg.sender is gonna be the address of a kit contract built on top of the API
        // Do you we wanna to make sure that the transaction is actually initialized by _individuation.origin ?
        // If this is the case then we're gonna need to ask for a proof of identity through a ECDSA signature
        // See https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/cryptography/ECDSA.sol

        RFIsLength = RFIsLength + 1;
        RFIid      = RFIsLength;

        Pando.RFI storage RFI = RFIs[RFIid];

        RFI.blockstamp = block.number;
        RFI.state      = Pando.RFIState.Pending;

        RFI.individuation.origin     = _individuation.origin;
        RFI.individuation.tree       = _individuation.tree;
        RFI.individuation.message    = _individuation.message;
        RFI.individuation.metadata   = _individuation.metadata;

        // solc 4.0.24 cannot directly convert dynamic struct array from memory to storage
        RFI.individuation.parents.length = _individuation.parents.length;
        for (uint256 i = 0; i < _individuation.parents.length; i++) {
            RFI.individuation.parents[i] = _individuation.parents[i];
        }

        for(uint256 j = 0; j < _lineages.length; j++) {
            uint256 RFLid = _createRFL(_lineages[j], RFIid);
            uint256 index = RFI.RFLids.length++;
            RFI.RFLids[index] = RFLid;
        }

        emit CreateRFI(RFIid);
    }

    function _createRFL(Pando.ILineage _lineage, uint256 _RFIid) internal returns (uint256 RFLid) {
        require(RFIs[_RFIid].individuation.origin != address(0));

        RFLsLength            = RFLsLength + 1;
        RFLid                 = RFLsLength;
        Pando.RFL storage RFL = RFLs[RFLid];

        RFL.lineage.destination = _lineage.destination;
        RFL.lineage.minimum     = _lineage.minimum;
        RFL.lineage.metadata    = _lineage.metadata;

        RFL.blockstamp = block.number;
        RFL.amount     = 0;
        RFL.state      = Pando.RFLState.Pending;
        RFL.RFIid      = _RFIid;

        emit CreateRFL(RFLid);
    }

    function _sortRFI(uint256 _RFIid, Pando.RFISorting _sorting) internal {
        Pando.RFI storage RFI = RFIs[_RFIid];

        if (_sorting == Pando.RFISorting.Merge) {
            RFI.state = Pando.RFIState.Merged;

            history.individuate(RFI.individuation);

            for (uint256 i = 0; i < RFI.RFLids.length; i++) {
                _mintRFL(RFI.RFLids[i]);
            }
        } else if (_sorting == Pando.RFISorting.Reject) {
            RFI.state = Pando.RFIState.Rejected;

            for (uint256 j = 0; j < RFI.RFLids.length; j++) {
                _cancelRFL(RFI.RFLids[j]);
            }
        } else {
            revert("Unknown sorting for RFI");
        }

        emit SortRFI(_RFIid, _sorting);
    }

    function _valuateRFL(uint256 _RFLid, uint256 _amount) internal {
        Pando.RFL storage RFL = RFLs[_RFLid];

        RFL.state  = Pando.RFLState.Valuated;
        RFL.amount = _amount;

        emit ValuateRFL(_RFLid, _amount);
    }

    function _rejectRFL(uint256 _RFLid) internal {
        Pando.RFL storage RFL = RFLs[_RFLid];

        RFL.state = Pando.RFLState.Rejected;
        _cancelRFI(RFL.RFIid);

        emit RejectRFL(_RFLid);
    }

    function _cancelRFI(uint256 _RFIid) internal {
        Pando.RFI storage RFI = RFIs[_RFIid];

        RFI.state = Pando.RFIState.Cancelled;

        for (uint256 i = 0; i < RFI.RFLids.length; i++) {
            Pando.RFL storage RFL = RFLs[RFI.RFLids[i]];

            if (RFL.state != Pando.RFLState.Rejected)
                _cancelRFL(RFI.RFLids[i]);
        }

        emit CancelRFI(_RFIid);
    }

    function _cancelRFL(uint256 _RFLid) internal {
        Pando.RFL storage RFL = RFLs[_RFLid];

        RFL.state = Pando.RFLState.Cancelled;

        emit CancelRFL(_RFLid);
    }

    function _mintRFL(uint256 _RFLid) internal {
        Pando.RFL storage RFL = RFLs[_RFLid];

        RFL.state = Pando.RFLState.Issued;
        lineage.mint(RFL.lineage.destination, RFL.amount);

        emit MintRFL(_RFLid, RFL.lineage.destination, RFL.amount);
    }
}
