pragma solidity ^0.4.15;

import "./StandardToken.sol";
import "./Ownable.sol";
import "./TokenHolder.sol";

contract FunnyToken is StandardToken, Ownable, TokenHolder {

   string public constant name = "FunnyToken";
   string public constant symbol = "FT";
   uint8 public constant decimals = 18;
   string public constant version = "1.0";

   uint256 public constant tokenUnit = 10 ** 18;
   uint256 public constant oneBillion = 10 ** 9;
   uint256 public constant maxTokens = 10 * oneBillion * tokenUnit;

   function FunnyToken() {
      totalSupply = maxTokens;
      balances[msg.sender] = maxTokens;
   }
}
