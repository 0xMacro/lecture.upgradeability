// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract SimpleBuggyLogic {
    uint256 public slot0;
    uint256 public someVariable;

    /// @dev This constructor sets data on the Logic contract,
    /// NOT the Proxy contract, so it's not doing what we want.
    /// Instead, we need to use an initializer function
    constructor(uint256 _someVariable, uint256 _slot0) {
        someVariable = _someVariable;
        slot0 = _slot0;
    }

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

    function setSlot0(uint256 newSlot0) external {
        slot0 = newSlot0;
    }
}
