pragma solidity ^0.4.11;

import './FunnyToken.sol';
import './SafeMath.sol';

/**
 * @title Crowdsale
 * @dev Crowdsale is a base contract for managing a token crowdsale.
 * Crowdsales have a start and end timestamps, where investors can make
 * token purchases and the crowdsale will assign them tokens based
 * on a token per ETH rate. Funds collected are forwarded to a wallet
 * as they arrive.
 */
contract FunnyTokenCrowdsale {
   using SafeMath for uint256;

   // The token being sold
   FunnyToken public funnyToken;

   uint256 public constant startTime = 1505674800; // 	3pm
   uint256 public constant endTime = 1505689200;   //  7pm

   // address where funds are collected
   address public wallet = "0x4F3Da41D2adb81e8e3A808E865b55c68f163b81A";

   // how many token units a buyer gets per wei
   uint256 public rate;

   // amount of raised money in wei
   uint256 public weiRaised;

   // maximum amount of wei to be raised
   uint256 public cap;


   uint256 public constant tokenUnit = 10 ** 18;
   uint256 public constant oneBillion = 10 ** 9;
   uint256 public constant maxTokens = 10 * oneBillion * tokenUnit;
   uint256 public constant maxTokensForSale = 4 * oneBillion * tokenUnit;


   function FunnyTokenCrowdsale(uint256 _rate, uint256 _cap) {
      require(_rate > 0);
      require(_cap > 0);

      funnyToken = new FunnyToken();
      rate = _rate;
      cap = _cap;
   }

   // fallback function can be used to buy tokens
   function () payable {
      buyTokens(msg.sender);
   }

   /**
   * event for token purchase logging
   * @param tokenBuyer who paid for the tokens
   * @param tokenReceiver who got the tokens
   * @param valueInWei weis paid for purchase
   * @param amountOfTokens amount of tokens purchased
   */
   event TokenPurchase(address indexed tokenBuyer, address indexed tokenReceiver, uint256 valueInWei, uint256 amountOfTokens);

   // low level token purchase function
   function buyTokens(address tokenReceiver) payable {
      require(tokenReceiver != 0x0);
      require(validPurchase());

      uint256 weiAmount = msg.value;

      // calculate token amount to be created
      uint256 tokens = weiAmount.mul(rate);

      // update state
      weiRaised = weiRaised.add(weiAmount);

      token.issueTokens(tokenReceiver, tokens);
      maxTokensForSale = maxTokensForSale.sub(_amount);

      TokenPurchase(msg.sender, tokenReceiver, weiAmount, tokens);

      depositEther();
   }

   // send ether to the fund collection wallet
   function depositEther() internal {
      wallet.transfer(msg.value);
   }

   // @return true if the transaction can buy tokens
   function validPurchase() internal constant returns (bool) {
      bool withinCap = weiRaised.add(msg.value) <= cap;
      bool withinPeriod = now >= startTime && now <= endTime;
      bool nonZeroPurchase = msg.value != 0;
      return withinPeriod && nonZeroPurchase && withinCap;
   }

   // @return true if crowdsale event has ended
   function hasEnded() public constant returns (bool) {
      bool capReached = weiRaised >= cap;
      bool deadlineHasPassed = now > endTime;
      return deadlineHasPassed || capReached;
   }
}
