var SafeMath = artifacts.require("./SafeMath.sol");
var KudosTokenLockup = artifacts.require("./KudosTokenLockup.sol");

module.exports = function(deployer) {
   deployer.deploy(SafeMath);
   deployer.link(SafeMath, KudosTokenLockup);
   deployer.deploy(KudosTokenLockup, '0xc61ac599aa46664d4a8c75bd3312c3ac4416c61d', '0x079f698415567dCA44A4cF8A2DD38FAf757776a7');
};
