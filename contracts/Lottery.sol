pragma solidity >=0.4.21 <0.7.0;

contract Lottery {

    struct Member {
        string name;
        uint amt;
        bool added;
        uint id;
    }

    mapping(address => Member) public members;
    mapping(uint => address) public peers;
    mapping(uint => address) public winners;
    address public owner;
    uint round;
    uint num;
    uint total;

    constructor() public {
        owner = msg.sender;
        round = 1;
        num = 0;
        total = 0;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function addMember(address _addr, string memory _name, uint _amt) public {
        if (num < 10 && !members[_addr].added) {
            Member storage member = members[_addr];
            member.name = _name;
            member.amt = _amt;
            member.added = true;
            for (uint i = 1; i <= 10; i++) {
                if (peers[i] == peers[11]) {
                    member.id = i;
                    peers[i] = _addr;
                    break;
                }
            }
            num += 1;
            total += _amt;
        }
    }

    function removeMember(address _addr) public {
        if (!members[_addr].added) {
            return;
        }
        uint id = members[_addr].id;
        delete peers[id];
        delete members[_addr];
        num -= 1;
    }

    function getId(address _addr) public view returns (uint) {
        return members[_addr].id;
    }

    function totalFunds() public view returns (uint) {
        return total;
    }

    function numPeers() public view returns (uint) {
        return num;
    }

    function exists(address _addr) public view returns (bool) {
        return members[_addr].added;
    }

    function roundCompleted() public view returns (uint) {
        return (round - 1);
    }

    function currentRound() public view returns (uint) {
        return round;
    }

    function reset() internal {
        require(msg.sender == owner, 'Only owner can call this function');
        for (uint i = 1; i <= num; i++) {
            address addr = peers[i];
            delete members[addr];
            delete peers[i];
        }
        num = 0;
    }

    function draw(uint _seed) public {
        require(msg.sender == owner, 'Only Onwer can call this function');
        if (_seed > 0 && _seed < 11) {
            winners[round] = peers[_seed];
            round += 1;
            reset();
        }
    }

    function getWinner(uint rnd) public view returns (address) {
        if (rnd > 0 && rnd < round) {
            return winners[rnd];
        }
    }
    
}