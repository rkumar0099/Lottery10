pragma solidity >=0.4.21 <0.7.0;

import "./Lottery.sol";

contract Owner {
    address owner;

    constructor() public {
        owner = msg.sender;
    }

}