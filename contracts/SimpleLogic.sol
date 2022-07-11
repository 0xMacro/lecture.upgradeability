// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SimpleLogic {
    uint256 public someVariable;

    function doSomething(uint256 someArg) external {
        someVariable = someArg;
    }

    function getThisAddress() view external returns (address) {
        return address(this);
    }
}