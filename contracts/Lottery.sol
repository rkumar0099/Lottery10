// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract Random is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 s_subscriptionId;
    address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
    bytes32 s_keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 internal numWords = 1;
    uint32 internal draw = 0;
    uint8 internal randomValue;
    uint8 internal constant IN_PROGRESS = 100;
    address internal owner;
    uint internal round;
    uint internal num;
    uint internal total;
    bool internal ROUND_PROGRESS = true;

    event initRandomSetup(uint256 requestId, uint32 draw);
    event RandomValueFilled(uint256 requestId, uint8 value);

    constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        owner = msg.sender;
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
        round = 1; // init current round
        num = 0; // init total num of peers registered
        total = 0; // init total amt;
    }

    function initRandom() public onlyOwner returns (uint256) {
        uint256 requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        draw += 1;
        randomValue = IN_PROGRESS;
        emit initRandomSetup(requestId, draw);
        return requestId;
    }


    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        randomValue = (uint8)(randomWords[0] % 10) + 1;
        emit RandomValueFilled(requestId, randomValue);
    }

    function getRandom() public view onlyOwner returns (uint8) {
        return randomValue;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'Only owner can call this function');
        _;
    }

    modifier checkRange(uint index) {
        require(index >= 0, 'index must be greater than equal to zero');
        require(index <= 9, 'index must be less than equal to nine');
        _;
    }
}

contract Lottery is Random(6346) {
    struct Member {
        string name;
        uint amt;
        bool added;
    }
    struct Winner {
        address addr;
        uint round;
        uint amt;
        bool decided;
    }
    mapping(uint => mapping(address => Member)) members;
    mapping(uint => Winner) public winners;
    mapping (uint => address) Ids;

    event MemberJoin(uint round, address member);
    event MemberWithdraw(uint round, address member);
    event WinnerDecided(uint rount, uint amt, address winner);

    function getOwner() public view returns (address) {
        return owner;
    }

    function addMember(address _addr, string memory _name, uint _amt)
        public checkAmt(_amt) checkRange(num) payable {
            require(ROUND_PROGRESS == true, 'The drawing of last round has not finished yet');
            require(members[round][_addr].added == false, 'Member already added');
            Member storage member = members[round][_addr];
            member.name = _name;
            member.amt = _amt;
            member.added = true;

            total += _amt;
            num += 1;
            Ids[num] = _addr;
            emit MemberJoin(round, _addr);
    }

    modifier checkAmt(uint amt) {
        require (msg.value == amt, 'Amt must be equal to msg value');
        _;
    }

    modifier checkMember(address addr) {
        require(members[round][addr].added == true, 'Member not added');
        _;
    }

    function withdraw(address _addr) public checkMember(_addr) {
        Member storage member = members[round][_addr];
        address payable to = payable(_addr);
        to.transfer(member.amt);
        total -= member.amt;
        num -= 1;
        delete members[round][_addr];
        emit MemberWithdraw(round, _addr);
    }

    function totalFunds() public view returns (uint) {
        return total;
    }

    function numPeers() public view returns (uint) {
        return num;
    }

    function exists(address _addr) public view returns (bool) {
        return members[round][_addr].added;
    }

    function roundCompleted() public view returns (uint) {
        return (round - 1);
    }

    function currentRound() public view returns (uint) {
        return round;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function transfer(address _addr, uint _amt) public onlyOwner {
        address payable to = payable(_addr);
        to.transfer(_amt);
    }

    function nextRound() public onlyOwner {
        round += 1;
        total = 0;
        num = 0;
        ROUND_PROGRESS = true;
    }

    function performDraw() public onlyOwner {
        require(num == 10, 'Total num of peers registered must be 10');
        require(winners[round].decided == false, 'The winner for this round has already been decided');
        ROUND_PROGRESS = false;
        uint8 seed = getRandom();
        Winner storage winner = winners[round];
        winner.addr = Ids[seed];
        winner.round = round;
        winner.amt = total;
        winner.decided = true;
        emit WinnerDecided(round, total, winner.addr);
    }

    modifier checkRnd(uint rnd) {
        require(rnd > 0, 'The round must be greater than zero');
        require(rnd <= round, 'The round must be less than equal to the current round');
        _;
    }

    function getWinner(uint _rnd) 
        public checkRnd(_rnd) view returns (address addr, uint rnd, uint amt) {
            Winner storage winner = winners[_rnd];
            return (winner.addr, winner.round, winner.amt);
        }
}