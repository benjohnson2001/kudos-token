pragma solidity ^0.4.15;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./KudosToken.sol";

contract KudosTokenSale is Ownable {
   using SafeMath for uint256;

   KudosToken public kudosToken;

   uint256 public constant startTime = 1505736000;
   uint256 public constant numberOfDays = 7;
   uint256 public constant ethPriceInDollars = 287;
   address public constant wallet = 0x079f698415567dCA44A4cF8A2DD38FAf757776a7;

   uint256 public constant tokenUnit = 10 ** 18;
   uint256 public constant oneMillion = 10 ** 6;
   uint256 public constant oneBillion = 10 ** 9;
   uint256 public constant amountOfTokensForSale = 4 * oneBillion * tokenUnit;

   uint256 public constant goalInDollars = 30 * oneMillion;
   uint256 public constant kutoasPerDollar = amountOfTokensForSale/goalInDollars;

   uint256 public constant weiPerDollar = uint256(1 ether) / ethPriceInDollars;
   uint256 public constant kutoasPerWei = kutoasPerDollar / weiPerDollar;

   function KudosTokenSale(address _tokenContractAddress) {
      require(_tokenContractAddress != 0);
      kudosToken = KudosToken(_tokenContractAddress);
   }

   function tokensAvailable() constant returns (uint256) {
      return kudosToken.balanceOf(this);
   }

   modifier whenTokenSaleIsActive() {
      require(tokenSaleIsActive());
      _;
   }

   function tokenSaleIsActive() constant returns (bool) {
      return (
         itIsAfterStartTime() &&
         itIsBeforeEndTime() &&
         tokensAreStillAvailable()
      );
   }

   function itIsAfterStartTime() constant returns (bool) {
      return now >= startTime;
   }

   function itIsBeforeEndTime() constant returns (bool) {
      return now <= startTime.add(numberOfDays * 1 days);
   }

   function tokensAreStillAvailable() constant returns (bool) {
      return tokensAvailable() > 0;
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
      assert(kudosToken.transfer(msg.sender, tokensToIssue));
      IssueTokens(msg.sender, tokensToIssue);

      // partial refund if full participation not possible due to cap being reached.
      uint256 refund = msg.value.sub(weiAmount);
      if (refund > 0) {
          msg.sender.transfer(refund);
      }
   }

   function getNumberOfTokensToIssue(uint256 weiAmount) internal constant returns (uint256) {

      uint256 numberOfTokensToIssue = weiAmount.mul(kutoasPerWei);

      // if purchase would cause less than kutoasPerWei tokens left then nobody could ever buy them,
      // then gift them to the last buyer.
      if (tokensAvailable().sub(numberOfTokensToIssue) < kutoasPerWei) {
         numberOfTokensToIssue = tokensAvailable();
      }

      return numberOfTokensToIssue;
   }

   function endTokenSale() onlyOwner {

      // transfer unsold tokens back to owner
      uint256 balance = kudosToken.balanceOf(this);
      assert(balance > 0);
      assert(kudosToken.transfer(owner, balance));

      selfdestruct(owner);
   }
}