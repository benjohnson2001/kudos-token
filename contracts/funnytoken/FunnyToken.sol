pragma solidity ^0.4.15;

import "./StandardToken.sol";
import "./Ownable.sol";

contract FunnyToken is StandardToken, Ownable {

   string public constant name = "FunnyToken";
   string public constant symbol = "FT";
   uint8 public constant decimals = 18;
   string public constant version = "1.0";

   uint256 public constant tokenUnit = 10 ** 18;
   uint256 public constant oneBillion = 10 ** 9;
   uint256 public constant maxTokens = 10 * oneBillion * tokenUnit;
   uint256 public constant maxTokensForSale = 4 * oneBillion * tokenUnit;

   function totalSupply() constant returns (uint256 totalSupply) {
      return maxTokens;
   }

   event TokenSaleHasBeenHalted();

   bool public tokenSaleHasBeenHalted = false;

   modifier canIssueTokens() {
      require(!tokenSaleHasBeenHalted);
      _;
   }

   /**
   * @dev Function to issue tokens
   * @param _to The address that will receive the issued tokens.
   * @param _amount The amount of tokens to issue.
   * @return A boolean that indicates if the operation was successful.
   */
   function issueTokens(address _to, uint256 _amount) onlyOwner canIssueTokens returns (bool) {
      balances[_to] = balances[_to].add(_amount);
      Transfer(0x0, _to, _amount);
      return true;
   }

   /**
   * @dev Function to stop issuing new tokens.
   * @return True if the operation was successful.
   */
   function haltTokenSale() onlyOwner returns (bool) {
      tokenSaleHasBeenHalted = true;
      TokenSaleHasBeenHalted();
      return true;
   }
}
