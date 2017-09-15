pragma solidity ^0.4.15;

import "./StandardToken.sol";

contract KudosToken is StandardToken {

   string public constant name = "Kudos";
   string public constant symbol = "KUDOS";
   uint8 public constant decimals = 18;
   string public constant version = "1.0";

   // token sale
   uint256 public constant startTime = 1508331600; // 	Oct 18 2017 09:00:00
   uint256 public constant endTime = 1509570000;   //    Nov 01 2017 17:00:00

   uint256 public constant tokenUnit = 10 ** 18;
   uint256 public constant maxTokens = 10 ** 10 * tokenUnit;
   uint256 public constant maxTokensForSale = 3500000000 * TOKEN_UNIT;

   function KudosToken() {

   }
}
