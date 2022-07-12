// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract SuperSimpleLogic {
    uint256 public bloop;
    uint256 public someVariable;

    function doSomething(uint256 someArg) payable external {
        console.log("Logic msg.data:");
        console.logBytes(msg.data);
        console.log("Logic msg.value: %s", msg.value);
        console.log("Logic msg.sender: %s", msg.sender);
        someVariable = someArg;
    }

    function getThisAddress() view external returns (address) {
        return address(this);
    }
}