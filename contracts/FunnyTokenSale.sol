pragma solidity ^0.4.15;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./FunnyToken.sol";

contract FunnyTokenSale is Ownable {
   using SafeMath for uint256;

   FunnyToken public funnyToken;

   uint256 public constant RATE = 2200; // Number of tokens per Ether
   uint256 public constant capInEther = 15910; // Cap in Ether
   uint256 public constant startTime = 1504594800; // Sep 5, 2017 @ 08:00 GMT+1
   uint256 public constant numberOfDays = 7;

   address public constant wallet = 0xebC75bC3C8676e4B4edd1E665d09E499BE9B9bDD;

   uint256 public constant tokenUnit = 10 ** 18;
   uint256 public constant oneBillion = 10 ** 9;
   uint256 public constant amountOfTokensForSale = 4 * oneBillion * tokenUnit;

   uint256 public totalWeiRaised = 0;

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
         tokenSaleContractHasBeenFunded() &&
         itIsAfterTokenSaleStartTime() &&
         itIsBeforeTokenSaleEndTime() &&
         goalHasNotBeenReached()
      );
   }

   function tokenSaleContractHasBeenFunded() constant returns (bool) {
      return tokensAvailable() == amountOfTokensForSale;
   }

   function itIsAfterTokenSaleStartTime() constant returns (bool) {
      return (now >= startTime);
   }

   function itIsBeforeTokenSaleEndTime() constant returns (bool) {
      return (now <= startTime.add(numberOfDays * 1 days));
   }

   function goalHasNotBeenReached() constant returns (bool) {
      return (totalWeiRaised < capInEther * 1 ether);
   }


   function () payable {
      issueTokens();
   }

   event IssueTokens(address indexed to, uint256 value);

   function issueTokens() payable whenTokenSaleIsActive {

      uint256 weiAmount = msg.value;
      require(weiAmount > 0);

      // calculate amount of tokens to sell
      uint256 kudosAmount = weiAmount.mul(RATE);

      IssueTokens(msg.sender, kudosAmount);

      // increment raised amount
      totalWeiRaised = totalWeiRaised.add(msg.value);

      // send KUDOS to buyer
      funnyToken.transfer(msg.sender, kudosAmount);

      // send ETH to wallet
      wallet.transfer(msg.value);
   }

   function endTokenSale() onlyOwner {

      // transfer unsold tokens back to owner
      uint256 balance = funnyToken.balanceOf(this);
      assert(balance > 0);
      funnyToken.transfer(owner, balance);

      selfdestruct(owner);
   }
}
