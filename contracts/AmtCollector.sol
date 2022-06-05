pragma solidity >=0.4.22 <0.9.0;

//pragma solidity >=0.4.21 <0.7.0;

contract AmtCollector {
    address public owner;
    uint public balance;

    constructor() public {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function addAmt() public payable {
        balance += msg.value;
    }

    function getAmt() public view returns (uint) {
        return balance;
    }

    function balanceOf(address _addr) public view returns (uint) {
        return _addr.balance;
    }

    function transferAmt(address payable _dst, uint _amt) public {
        require(msg.sender == owner, 'Only owner can transfer funds');
        require(_amt <= balance, 'Insufficient Balance');

        _dst.transfer(_amt);
        balance -= _amt;
    }

}