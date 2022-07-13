// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SimpleBuggyProxy {

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

    /// @dev Use DELEGATECALL to forward this function call to the logic contract.
    /// This means the logic contract will use the msg.sender, msg.value, and msg.data from
    /// the Proxy's context but use the code from the Logic contract
    function delegateTheCall() internal {
        assembly {
            // get the address of the logic contract
            let contractLogic := sload(0)

            // get a pointer to "free memory". `ptr` is an address in memory
            // where our contract is free to write data to. In this case, we're
            // going to store the calldata (msg.data) there. Typically it is 0x80.
            let ptr := mload(0x40)

            // copy all of calldata into memory, starting at the address represented
            // by `ptr`
            calldatacopy(ptr, 0x0, calldatasize())

            // make the external DELEGATECALL
            let success := delegatecall(
                gas(),
                contractLogic,
                ptr,
                calldatasize(),
                0,
                0
            )

            // copy the return data (if any) into the address represented
            // by `ptr`
            let retSz := returndatasize()
            returndatacopy(ptr, 0, retSz)

            // revert or return, based on the output of DELEGATECALL
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