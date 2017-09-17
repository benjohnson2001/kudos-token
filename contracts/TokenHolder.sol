pragma solidity ^0.4.15;

import './ERC20Token.sol';
import './Ownable.sol';

/// @title Token holder contract.
contract TokenHolder is Ownable {
    /// @dev Allow the owner to transfer any ERC20 tokens accidentally sent to the contract address.
    /// @param _tokenAddress address The address of the ERC20 contract.
    /// @param _amount uint256 The amount of tokens to be transferred.
    function transferAnyERC20Token(address _tokenAddress, uint256 _amount) onlyOwner returns (bool success) {
        return ERC20Token(_tokenAddress).transfer(owner, _amount);
    }
}
