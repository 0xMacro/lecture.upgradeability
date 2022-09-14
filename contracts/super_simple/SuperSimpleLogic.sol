// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

import "hardhat/console.sol";

contract SuperSimpleLogic {
    uint256 public slot0;
    uint256 public someVariable;

    function setVariable(uint256 someArg) external payable {
        console.log("Logic msg.data:");
        console.logBytes(msg.data);
        console.log("Logic msg.value: %s", msg.value);
        console.log("Logic msg.sender: %s", msg.sender);
        someVariable = someArg;
    }

    function getThisAddress() external view returns (address) {
        return address(this);
    }
}
