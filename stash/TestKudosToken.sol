pragma solidity ^0.4.15;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/KudosToken.sol";

contract TestKudosToken {

  function testInitialBalanceUsingDeployedContract() {
    KudosToken kudosToken = KudosToken(DeployedAddresses.KudosToken());

    uint expected = 10*(10**9)*(10**18);

    Assert.equal(kudosToken.balanceOf(msg.sender), expected, "Owner should have 10 billion KudosToken initially");
  }

  function testInitialBalanceWithNewContract() {
    KudosToken kudosToken = new KudosToken();

    uint expected = 10*(10**9)*(10**18);

    Assert.equal(kudosToken.balanceOf(this), expected, "Owner should have 10 billion KudosToken initially");
  }

}
