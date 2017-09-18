pragma solidity ^0.4.15;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./FunnyToken.sol";

contract FunnyTokenSale is Ownable {
   using SafeMath for uint256;

   FunnyToken public funnyToken;

   uint256 public constant startTime = 1504594800;
   uint256 public constant numberOfHours = 1;
   uint256 public constant ethPriceInDollars = 289;
   address public constant wallet = 0xebC75bC3C8676e4B4edd1E665d09E499BE9B9bDD;

   uint256 public constant tokenUnit = 10 ** 18;
   uint256 public constant oneMillion = 10 ** 6;
   uint256 public constant oneBillion = 10 ** 9;
   uint256 public constant initialAmountOfTokensForSale = 4 * oneBillion * tokenUnit;

   uint256 public constant goalInDollars = 30 * oneMillion;
   uint256 public constant kutoasPerDollar = initialAmountOfTokensForSale/goalInDollars;

   uint256 public constant weiPerDollar = uint256(1 ether) / ethPriceInDollars;
   uint256 public constant kutoasPerWei = kutoasPerDollar / weiPerDollar;

   function FunnyTokenSale(address _tokenContractAddress) {
      require(_tokenContractAddress != 0);
      funnyToken = FunnyToken(_tokenContractAddress);
   }

   function tokensAvailable() constant returns (uint256) {
      return funnyToken.balanceOf(this);
   }

   modifier whenTokenSaleIsActive() {
      require(tokenSaleIsActive());
      _;
   }

   function tokenSaleIsActive() constant returns (bool) {
      return (
         itIsAfterTokenSaleStartTime() &&
         itIsBeforeTokenSaleEndTime() &&
         goalHasNotBeenReached()
      );
   }

   function itIsAfterTokenSaleStartTime() constant returns (bool) {
      return (now >= startTime);
   }

   function itIsBeforeTokenSaleEndTime() constant returns (bool) {
      return (now <= startTime.add(numberOfHours * 1 hours));
   }

   function goalHasNotBeenReached() constant returns (bool) {
      return (tokensAvailable() > 0);
   }

   function () payable {
      issueTokens();
   }

   event IssueTokens(address indexed to, uint256 value);

   function issueTokens() payable whenTokenSaleIsActive {

      require(msg.value > 0);

      uint256 weiLeftInSale = tokensAvailable().div(kutoasPerWei);
      uint256 weiAmount = SafeMath.min256(msg.value, weiLeftInSale);

      // transfer wei to wallet
      wallet.transfer(weiAmount);

      // issue tokens and send to buyer
      uint256 tokensToIssue = getNumberOfTokensToIssue(weiAmount);
      funnyToken.transfer(msg.sender, tokensToIssue);
      IssueTokens(msg.sender, tokensToIssue);

      // partial refund if full participation not possible due to cap being reached.
      uint256 refund = msg.value.sub(weiAmount);
      if (refund > 0) {
          msg.sender.transfer(refund);
      }
   }

   function getNumberOfTokensToIssue(uint256 weiAmount) internal constant returns (uint256) {

      uint256 numberOfTokensToIssue = weiAmount.mul(kutoasPerWei);

      // if purchase would cause less than kutoasPerWei tokens left so nobody could ever buy them,
      // then gift them to the last buyer.
      if (tokensAvailable().sub(numberOfTokensToIssue) < kutoasPerWei) {
          numberOfTokensToIssue = tokensAvailable();
      }

      return numberOfTokensToIssue;
   }

   function endTokenSale() onlyOwner {

      // transfer unsold tokens back to owner
      uint256 balance = funnyToken.balanceOf(this);
      assert(balance > 0);
      funnyToken.transfer(owner, balance);

      selfdestruct(owner);
   }
}
