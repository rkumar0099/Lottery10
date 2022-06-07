pragma solidity >=0.4.22 <0.9.0;

contract Lottery {

    struct Member {
        string name;
        uint amt;
        bool added;
        uint id;
    }

    struct Winner {
        address addr;
        uint round;
        uint amt;
        bool decided;
    }

    mapping(address => Member) public members;
    mapping(uint => Winner) public wins;
    mapping(uint => address) public peers;
    address public owner;
    uint round;
    uint num;
    uint total;

    constructor() public {
        owner = msg.sender; // init owner
        round = 1; // init current round
        num = 0; // init total num of peers registered
        total = 0; // init total amt;
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
        total -= members[_addr].amt;
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
        round += 1;
        num = 0;
        total = 0;
    }

    function draw(uint _seed) public {
        require(msg.sender == owner, 'Only Onwer can call this function');
        require(num == 10, 'Total num of peers registered must be 10');
        if (_seed > 0 && _seed < 11 && !wins[round].decided) {
            Winner storage winner = wins[round];
            winner.addr = peers[_seed];
            winner.round = round;
            winner.amt = total;
            winner.decided = true;
            reset();
        }
    }

    function getWinner(uint _rnd) public view returns (address addr, uint rnd, uint amt) {
        if (_rnd > 0 && _rnd < round && wins[_rnd].decided) {
            return (wins[_rnd].addr, wins[_rnd].round, wins[_rnd].amt);
        }
    }
}