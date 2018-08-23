pragma solidity ^0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "./utils/Strings.sol";


contract Branch is AragonApp {
    using SafeMath for uint256;


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

    struct Snapshot {
        address author;
        uint256 block;
        uint256 value;
        string  cid;
    }


    string name;
    Snapshot[] snapshots;

    bytes32 constant public PUSH = bytes32(1);

    bytes32 constant public CREATE_BRANCH_ROLE   = keccak256("CREATE_BRANCH_ROLE");
    bytes32 constant public DELETE_BRANCH_ROLE   = keccak256("DELETE_BRANCH_ROLE");

    bytes32 constant public SUBMIT_SNAPSHOT_ROLE = keccak256("SUBMIT_SNAPSHOT_ROLE");
    bytes32 constant public MERGE_SNAPSHOT_ROLE  = keccak256("MERGE_SNAPSHOT_ROLE");



    string constant public SEPARATOR = "0x|x0";

    Branch[] public branches;
    mapping(bytes32 => BranchID) knownBranches;

    event NewBranch(string name, uint branchID);
    event NewSnapshot(string branch, address author, string cid);

    /**
    * @notice Initializes ShareVoting app with `_token.symbol(): string` for governance, minimum participation of `(_minParticipationPct - _minParticipationPct % 10^14) / 10^16` and vote durations of `(_voteTime - _voteTime % 86400) / 86400` day `_voteTime >= 172800 ? 's' : ''`
    * @param _token MiniMeToken Address that will be used as governance token
    * @param _minParticipationPct Percentage of voters that must participate in a vote for it to succeed (expressed as a 10^18 percentage, eg 10^16 = 1%, 10^18 = 100%)
    * @param _voteTime Seconds that a vote will be open for token holders to vote (unless enough yeas or nays have been cast to make an early decision)
    */
    function initialize(MiniMeToken _token, uint256 _minParticipationPct, uint64 _voteTime
    ) onlyInit external
    {
        initialized();

        require(_minParticipationPct > 0);

        token = _token;
        minParticipationPct = _minParticipationPct;
        voteTime = _voteTime;

        votes.length += 1;
    }



    function initialize() public onlyInit {
        initialized();
    }

    function quantify() public {

    }

    function merge() public {

    }

    function isBranch(bytes32 _branchNameHash) public view returns (bool) {
        return knownBranches[_branchNameHash].exists;
    }

    function setHead(string _branchName, string _head) public auth(PUSH) {
        bytes32 hash = keccak256(_branchName);
        require(isBranch(hash));

        uint branchID = knownBranches[hash].id;
        branches[branchID].snapshots.push(Snapshot(msg.sender, block.number, _head));

        NewSnapshot(_branchName, msg.sender, _head);
    }

    function getHead(string _branchName) public view returns (string cid_) {
        bytes32 hash = keccak256(_branchName);
        require(isBranch(hash));

        uint branchID = knownBranches[hash].id;
        if (branches[branchID].snapshots.length != 0) {
            return branches[branchID].snapshots[branches[branchID].snapshots.length - 1].cid;
        } else {
            return "undefined";
        }
    }

    function newBranch(string _branchName) public auth(PUSH) returns (uint) {
        bytes32 hash = keccak256(_branchName);
        require(!isBranch(hash));

        uint branchID = branches.length++;
        branches[branchID].name = _branchName;
        knownBranches[hash] = BranchID(true, branchID);

        NewBranch(_branchName, branchID);

        return branchID;
    }

    function getBranchesName() public view returns (string) {
        uint length = branches.length;
        string memory _branches;

        for (uint i = 0 ; i < length ; i++) {
            _branches = _branches.toSlice().concat(branches[i].name.toSlice());
            _branches = _branches.toSlice().concat(SEPARATOR.toSlice());
        }

        return _branches;
    }
}
