// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SuperSimpleProxy {

    /// @dev The contract address that the SimpleProxy will delegate all functions calls to
    address public logicContract;

    constructor(address _logicContract) {
        logicContract = _logicContract;
    }

    error DelegateCallFailed(bytes);

    /// @notice Points this Proxy's logic contract address to a new contract,
    /// allowing the Proxy to upgrade itself
    function upgrade(address _newLogic) external {
        logicContract = _newLogic;
    }

    fallback() external payable {
        delegateTheCall();
    }

    receive() external payable {
        delegateTheCall();
    }

    /// @dev This is the most important Proxy logic. In it, we forward the function call
    /// (msg.data, which contains the 4 byte function selector as well as the function arguments)
    /// to the logic contract using `delegatecall`. `delegatecall` will cause whatever function
    /// gets called to use the msg.sender, msg.value, and msg.data from the Proxy's context but
    /// use the code from the Logic contract
    function delegateTheCall() internal {
        (bool success, bytes memory data) = address(logicContract).delegatecall(msg.data);

        if (!success) {
            revert DelegateCallFailed(data);
        }
        // in this super simple example, we don't handle the return data; it is lost :(
    }
}