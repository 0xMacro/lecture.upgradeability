// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SimpleProxy {

    /// @dev The contract address that the SimpleProxy will delegate all functions calls to
    address public logicContract;

    constructor(address _logicContract) {
        logicContract = _logicContract;
    }

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
        assembly {
            let contractLogic := sload(0)
            let ptr := mload(0x40)
            calldatacopy(ptr, 0x0, calldatasize())
            let success := delegatecall(
                gas(),
                contractLogic,
                ptr,
                calldatasize(),
                0,
                0
            )
            let retSz := returndatasize()
            returndatacopy(ptr, 0, retSz)
            switch success
            case 0 {
                revert(ptr, retSz)
            }
            default {
                return(ptr, retSz)
            }
        }
    }
}