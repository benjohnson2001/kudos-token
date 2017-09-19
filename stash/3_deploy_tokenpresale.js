var SafeMath = artifacts.require("./SafeMath.sol");
var KudosTokenLockup = artifacts.require("./KudosTokenLockup.sol");

module.exports = function(deployer) {
   deployer.deploy(SafeMath);
   deployer.link(SafeMath, KudosTokenLockup);
   deployer.deploy(KudosTokenLockup, '0x54dd06274f927b722dc0a5578bc5f55f62f700f6', '0x079f698415567dCA44A4cF8A2DD38FAf757776a7');
};
