pragma solidity 0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/common/IForwarder.sol";
import "@aragon/os/contracts/lib/minime/MiniMeToken.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath64.sol";
import "@aragon/os/contracts/lib/misc/Migrations.sol";


contract ShareVoting is IForwarder, AragonApp {
    using SafeMath for uint256;
    using SafeMath64 for uint64;

    MiniMeToken public token;
    uint256 public minParticipationPct;
    uint64 public voteTime;

    uint256 constant public PCT_BASE = 10 ** 18; // 0% = 0; 1% = 10^16; 100% = 10^18

    bytes32 constant public CREATE_VOTES_ROLE = keccak256("CREATE_VOTES_ROLE");
    bytes32 constant public MODIFY_PARTICIPATION_ROLE = keccak256("MODIFY_CANDIDATE_SUPPORT_ROLE");


    struct Vote {
        address creator;
        uint64 startDate;
        uint256 snapshotBlock;
        uint256 minParticipationPct;
        uint256 totalValue;
        uint256 totalWeight;
        uint256 totalVoters;
        string metadata;
        bytes executionScript;
        bool executed;
        mapping (address => uint256) voters;
    }

    Vote[] internal votes; // first index is 1

    event Test(bytes value);
    event StartVote(uint256 indexed voteId);
    event CastVote(uint256 indexed voteId, address indexed voter, uint256 value, uint256 weight);
    event ExecuteVote(uint256 indexed voteId);
    event ChangeMinParticipation(uint256 minParticipationPct);

    /**
    * @notice Initializes ShareVoting app with `_token.symbol(): string` for governance, minimum participation of `(_minParticipationPct - _minParticipationPct % 10^14) / 10^16` and vote durations of `(_voteTime - _voteTime % 86400) / 86400` day `_voteTime >= 172800 ? 's' : ''`
    * @param _token MiniMeToken Address that will be used as governance token
    * @param _minParticipationPct Percentage of voters that must participate in a vote for it to succeed (expressed as a 10^18 percentage, eg 10^16 = 1%, 10^18 = 100%)
    * @param _voteTime Seconds that a vote will be open for token holders to vote (unless enough yeas or nays have been cast to make an early decision)
    */
    function initialize(
        MiniMeToken _token,
        uint256 _minParticipationPct,
        uint64 _voteTime
    ) onlyInit external
    {
        initialized();

        require(_minParticipationPct > 0);

        token = _token;
        minParticipationPct = _minParticipationPct;
        voteTime = _voteTime;

        votes.length += 1;
    }

    /**
    * @notice Change minimum participation percentage to `(_minParticipationPct - _minParticipationPct % 10^16) / 10^14`%
    * @param _minParticipationPct New minimum participation percentage
    */
    function changeMinParticipationPct(uint256 _minParticipationPct) authP(MODIFY_PARTICIPATION_ROLE, arr(_minParticipationPct, minParticipationPct)) isInitialized external {
        require(_minParticipationPct > 0);
        minParticipationPct = _minParticipationPct;

        ChangeMinParticipation(_minParticipationPct);
    }

    /**
    * @notice Create a new vote about "`_metadata`"
    * @param _executionScript EVM script to be executed on approval
    * @param _metadata Vote metadata
    * @return voteId Id for newly created vote
    */
    function newVote(bytes _executionScript, string _metadata) auth(CREATE_VOTES_ROLE) external returns (uint256 voteId) {
        return _newVote(_executionScript, _metadata);
    }

    /**
     * @notice Create a new vote about "`_metadata`"
     * @param _executionScript EVM script to be executed on approval
     * @param _metadata Vote metadata
     * @param _castVote Whether to also cast newly created vote
     * @return voteId id for newly created vote
     */
    /* function newVote(bytes _executionScript, string _metadata, bool _castVote) auth(CREATE_VOTES_ROLE) external returns (uint256 voteId) {
        return _newVote(_executionScript, _metadata, _castVote);
    } */

    /**
    * @notice Grant a value of `value` in vote #`_voteId`
    * @param _voteId Id for vote
    * @param _value Value granted to the proposal
    * @param _executesIfDecided Whether the vote should execute its action if it becomes decided
    */
    function vote(uint256 _voteId, uint256 _value, bool _executesIfDecided) isInitialized external {
        require(canVote(_voteId, msg.sender));

        _vote(
            _voteId,
            _value,
            msg.sender,
            _executesIfDecided
        );
    }

    /**
    * @notice Execute the result of vote #`_voteId`
    * @param _voteId Id for vote
    */
    function executeVote(uint256 _voteId) isInitialized external {
        require(canExecute(_voteId));
        _executeVote(_voteId);
    }

    function isForwarder() public pure returns (bool) {
        return true;
    }

    /**
    * @notice Creates a vote to execute the desired action, and casts a support vote
    * @dev IForwarder interface conformance
    * @param _evmScript Start vote with script
    */
    function forward(bytes _evmScript) public {
        require(canForward(msg.sender, _evmScript));
        _newVote(_evmScript, "");
    }

    function canForward(address _sender, bytes _evmCallScript) public view returns (bool) {
        return canPerform(_sender, CREATE_VOTES_ROLE, arr());
    }

    function canVote(uint256 _voteId, address _voter) public view returns (bool) {
        Vote storage vote = votes[_voteId];

        return _isVoteOpen(vote) && token.balanceOfAt(_voter, vote.snapshotBlock) > 0;
    }

    function canExecute(uint256 _voteId) public view returns (bool) {
        Vote storage vote = votes[_voteId];
        if (vote.executed)
            return false;

        // vote is already decided
        if (_isValuePct(vote.totalWeight, vote.totalVoters, vote.minParticipationPct))
            return true;

        // vote ended?
        if (_isVoteOpen(vote))
            return false;

        // has minimun participation percentage?
        if (!_isValuePct(vote.totalWeight, vote.totalVoters, vote.minParticipationPct))
            return false;

        return true;
    }

    function getVote(uint256 _voteId) public view returns (bool open, bool executed, address creator, uint64 startDate, uint256 snapshotBlock, uint256 minParticipation, uint256 totalValue, uint256 totalWeight, uint256 totalVoters, bytes script) {
        Vote storage vote = votes[_voteId];

        open = _isVoteOpen(vote);
        executed = vote.executed;
        creator = vote.creator;
        startDate = vote.startDate;
        snapshotBlock = vote.snapshotBlock;
        minParticipation = vote.minParticipationPct;
        totalValue = vote.totalValue;
        totalWeight = vote.totalWeight;
        totalVoters = vote.totalVoters;
        script = vote.executionScript;
    }

    /**
    * @notice `getVoteMetadata` simply pulls the vote metadata out of a vote
    *         struct and returns the individual value.
    * @param _voteId The ID of the Vote struct in the `votes` array
    */
    function getVoteMetadata(uint256 _voteId) public view returns (string) {
        return votes[_voteId].metadata;
    }


    /**
    * @notice `getVoterState` allows a user to get the vote weights for a given
    *         voter.
    * @param _voteId The ID of the Vote struct in the `votes` array.
    * @param _voter The voter whose weights will be returned
    */
    function getVoterState(uint256 _voteId, address _voter) public view returns (uint256) {
        return votes[_voteId].voters[_voter];
    }


    function _newVote(bytes _executionScript, string _metadata) isInitialized internal returns (uint256 voteId) {
        voteId = votes.length++;
        Vote storage vote = votes[voteId];
        vote.executionScript = _executionScript;
        vote.creator = msg.sender;
        vote.startDate = uint64(now);
        vote.metadata = _metadata;
        vote.snapshotBlock = getBlockNumber() - 1; // avoid double voting in this very block
        vote.totalVoters = token.totalSupplyAt(vote.snapshotBlock);
        vote.minParticipationPct = minParticipationPct;

        StartVote(voteId);
    }

    function _vote(
        uint256 _voteId,
        uint256 _value,
        address _voter,
        bool _executesIfDecided
    ) internal
    {
        Vote storage vote = votes[_voteId];

        // this could re-enter, though we can assume the governance token is not malicious
        uint256 voterWeight = token.balanceOfAt(_voter, vote.snapshotBlock);
        uint256 voterValue = vote.voters[_voter];

        // if voter had previously voted, decrease count
        if (voterValue != 0) {
          vote.totalValue = vote.totalValue.sub(voterValue.mul(voterWeight));
          vote.totalWeight = vote.totalWeight.sub(voterWeight);
        }

        vote.totalValue = vote.totalValue.add(_value.mul(voterWeight));
        vote.totalWeight = vote.totalWeight.add(voterWeight);
        vote.voters[_voter] = _value;

        CastVote(
            _voteId,
            _voter,
            _value,
            voterWeight
        );

        if (_executesIfDecided && canExecute(_voteId))
            _executeVote(_voteId);
    }

    function _executeVote(uint256 _voteId) internal {
        Vote storage vote = votes[_voteId];
        uint256 scriptLength = 64; // 4 (spec) + 20 (address) + 4 (calldataLength) +  32 (input) + 4 (padding from 60 to 64)
        uint256 value = vote.totalValue.div(vote.totalWeight);
        bytes memory executionScript = new bytes(scriptLength);

        vote.executed = true;
        executionScript = vote.executionScript;

        assembly {
            mstore(add(executionScript, 0x40), value)
        }

        runScript(executionScript, new bytes(0), new address[](0));

        ExecuteVote(_voteId);
    }

    function _isVoteOpen(Vote storage vote) internal view returns (bool) {
        return uint64(now) < vote.startDate.add(voteTime) && !vote.executed;
    }

    /**
    * @dev Calculates whether `_value` is at least a percentage `_pct` of `_total`
    */
    function _isValuePct(uint256 _value, uint256 _total, uint256 _pct) internal pure returns (bool) {
        if (_total == 0) {
            return false;
        }
        uint256 computedPct = _value.mul(PCT_BASE) / _total;

        return computedPct >= _pct;
    }

    // Remettre pure sur isValuePct
}
