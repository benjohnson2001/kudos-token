pragma solidity ^0.4.15;

import "./StandardToken.sol";

/**
 * @title Kudos Token
 * @dev ERC20 Kudos Token (KUDOS)
 *
 * Kudos tokens are displayed using 18 decimal places of precision.
 *
 * The base units of Kudos tokens are referred to as "kutoas".
 *
 * In Swahili, kutoa means "to give".
 * In Finnish, kutoa means "to weave" or "to knit".
 *
 * 1 KUDOS is equivalent to:
 *
 *    1,000,000,000,000,000,000 == 1 * 10**18 == 1e18 == One Quintillion kutoas
 *
 *
 * All initial KUDOS kutoas are assigned to the creator of this contract.
 *
 */
contract KudosToken is StandardToken {

   string public constant name = "Kudos";
   string public constant symbol = "KUDOS";
   uint8 public constant decimals = 18;
   string public constant version = "1.0";

   // token sale
   uint256 public constant startTime = 1508331600; // 	Oct 18 2017 09:00:00
   uint256 public constant endTime = 1509570000;   //    Nov 01 2017 17:00:00

   uint256 public constant tokenUnit = 10 ** 18;
   uint256 public constant oneBillion = 10 ** 9;
   uint256 public constant maxTokens = 10 * oneBillion * tokenUnit;
   uint256 public constant maxTokensForSale = 4 * oneBillion * tokenUnit;

   function totalSupply() constant returns (uint256 totalSupply) {
      return maxTokens;
   }
}
