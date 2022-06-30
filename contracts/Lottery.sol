// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";


contract Lottery is VRFConsumerBaseV2 {
    struct Member {
        address addr;
        uint amt;
        bool added;
    }

    VRFCoordinatorV2Interface COORDINATOR;
    uint64 s_subscriptionId;
    address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
    bytes32 s_keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 internal numWords = 1;
    uint32 internal draw = 0;
    address public owner;
    uint public round;
    bool private ROUND_PROGRESS = true;
    uint private constant MIN_AMT = 1000000000000000;
    uint private draw_rnd;

    mapping(uint => mapping(uint => Member)) members;
    mapping(uint => mapping(address => uint)) added;
    mapping(uint => uint) funds;
    mapping (uint => uint256) draws;
    mapping(uint => bool) redeems;
    mapping(uint => uint) peers;

    event initRandomSetup(uint256 requestId, uint32 draw);
    event MemberJoin(uint round, address member);
    event MemberWithdraw(uint round, address member);
    event WinnerRedeem(uint round, uint amt, address addr);

    constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        owner = msg.sender;
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
        round = 1; // init current round
        peers[round] = 0;
        funds[round] = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'Only owner can call this function');
        _;
    }

    modifier checkAmt(uint amt) {
        require (msg.value == amt, 'Amt must be equal to msg value');
        _;
    }

    modifier checkRnd(uint rnd) {
        require(rnd > 0, 'The round must be greater than zero');
        require(rnd <= round, 'The round must be less than equal to the current round');
        _;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function addMember(address _addr, string memory, uint _amt)
        external checkAmt(_amt) payable {
            require(peers[round] < 10, 'Ten members have already registered!');
            require(added[round][_addr] == 0, 'Member already added');
            require(msg.value >= MIN_AMT, 'You must invest at least 0.001 ETH to participate!');
            for (uint i = 1; i <= 10; i++) {
                if (!members[round][i].added) {
                    Member storage member = members[round][i];
                    member.addr = _addr;
                    member.amt = _amt;
                    member.added = true;
                    added[round][_addr] = i;
                    break;
                }
            }
            peers[round] += 1;
            funds[round] += _amt;
            emit MemberJoin(round, _addr);
            // stop members withdrawal after 10 members registered for that round
            // increment round so others can still register for next round
            if (peers[round] == 10) {
                nextRound();
            }
    }

    function withdraw(address _addr) external {
        require(msg.sender == _addr, 'Sender addr not same as parameter passed!');
        require(added[round][_addr] != 0, 'Member not added');
        uint id = added[round][_addr];
        Member storage member = members[round][id];
        address payable to = payable(_addr);
        to.transfer(member.amt);
        funds[round] -= member.amt;
        peers[round] -= 1;
        added[round][_addr] = 0;
        delete members[round][id];
        emit MemberWithdraw(round, _addr);
    }

    function numPeers(uint _rnd) public view returns (uint) {
        return peers[_rnd];
    }

    function exists(address _addr, uint _rnd) public view returns (bool) {
        if(added[_rnd][_addr] == 0) {
            return false;
        }
        return true;
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

    function getReward(uint _rnd) public view returns (uint) {
        require(funds[_rnd] > 0, 'Insufficient funds!');
        uint fee = funds[_rnd] / 10; // 10% commission for the contract
        uint reward = funds[_rnd] - fee; // reward to the winner
        return reward;
    }

    function redeem(address _addr, uint _rnd) checkRnd(_rnd) external {
        require(msg.sender == _addr, 'Sender addr not same as parameter passed!');
        require(redeems[_rnd] == false, 'The amt for this round is already redeemed');
        require(added[_rnd][_addr] != 0, 'Member did not participate');
        require(draws[_rnd] != 0, 'Winner not decided yet');
        require(_addr == members[_rnd][draws[_rnd]].addr, 'Only Winner of this round can redeem the amount');
        redeems[_rnd] = true;
        uint reward = getReward(_rnd);
        payable(_addr).transfer(reward);
        emit WinnerRedeem(_rnd, reward, _addr);
    }

    function nextRound() internal {
        round += 1;
        ROUND_PROGRESS = true;
    }

    function performDraw(address _addr, uint _rnd) external {
        require(msg.sender == _addr, 'Sender addr not same as parameter passed!');
        require(draws[_rnd] == 0, 'Draw for this round has been completed!');
        require(peers[_rnd] == 10, 'Total num of peers registered for this round must be 10');
        require(added[_rnd][_addr] != 0, 'You did not participate!');
        require(ROUND_PROGRESS == true, 'Draw is taking place. Pls wait !');
        ROUND_PROGRESS = false;
        uint256 requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        draw_rnd = _rnd;
        draw += 1;
        emit initRandomSetup(requestId, draw);
    }

    function getDrawn(uint _rnd) public onlyOwner view returns (uint) {
        require(draws[_rnd] != 0, 'The draw is not yet decided');
        return draws[_rnd];
    }

    function drawCompleted(uint _rnd) public view returns (bool) {
        if (draws[_rnd] != 0) {
            return true;
        }
        return false;
    }

    function redeemCompleted(uint _rnd) public view returns (bool) {
        return redeems[_rnd];
    }

    function eligibleDraw(address _addr, uint _rnd) public view returns (bool) {
        require(msg.sender == _addr, 'Sender addr not same as parameter passed!');
        require(drawCompleted(_rnd) == false, 'Draw already completed!');
        require(peers[_rnd] == 10, 'Number of peers registered must be 10');
        require(added[_rnd][_addr] != 0, 'You did not participate!');
        return true;
    }

    function eligibleRedeem(address _addr, uint _rnd) public view returns (bool) {
        require(msg.sender == _addr, 'Sender addr not same as parameter passed!');
        require(drawCompleted(_rnd) == true, 'Draw has not yet taken place!');
        (address addr, ) = getWinner(_rnd);
        if (addr == _addr) {
            return true;
        }
        return false;
    }

    function fulfillRandomWords(uint256, uint256[] memory randomWords) internal override {
        draws[draw_rnd] = (randomWords[0] % 10) + 1;
        ROUND_PROGRESS = true; // allow another draw
    }

    function getWinner(uint _rnd) public checkRnd(_rnd) view returns (address addr, uint amt) {
        require(draws[_rnd] != 0, 'Winner is not yet decided!');
        Member storage member = members[_rnd][draws[_rnd]];
        addr = member.addr;
        amt = getReward(_rnd);
    }
}