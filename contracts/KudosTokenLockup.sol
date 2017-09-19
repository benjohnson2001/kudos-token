pragma solidity ^0.4.15;

import "./SafeMath.sol";
import './KudosToken.sol';

/**
* @title KudosTokenLockup
* @dev KudosTokenLockup is a token holder contract that will allow a
* beneficiary to extract the tokens after a year
*/
contract KudosTokenLockup {
   using SafeMath for uint256;

   KudosToken kudosToken;

   // beneficiary of tokens after they are released
   address beneficiary;

   // timestamp when token release is enabled
   uint256 public releaseTime;

   function KudosTokenLockup(address _tokenContractAddress, address _beneficiary) {
      require(_releaseTime > now);
      releaseTime = now.add(1 year);
      kudosToken = _KudosToken(_tokenContractAddress);
      beneficiary = _beneficiary;
   }

   /**
   * @notice Transfers tokens held by timelock to beneficiary.
   */
   function release() {
      require(now >= releaseTime);

      uint256 amount = kudosToken.balanceOf(this);
      require(amount > 0);

      assert(kudosToken.transfer(beneficiary, amount));
   }
}
