var SafeMath = artifacts.require("./SafeMath.sol");
var KudosTokenLockup = artifacts.require("./KudosTokenLockup.sol");

module.exports = function(deployer) {
   deployer.deploy(SafeMath);
   deployer.link(SafeMath, KudosTokenLockup);

   var tokenContractAddress = '';
   var beneficiary = '0x4F3Da41D2adb81e8e3A808E865b55c68f163b81A';

   deployer.deploy(KudosTokenLockup, tokenContractAddress, beneficiary);
};
