var SafeMath = artifacts.require("./SafeMath.sol");
var KudosTokenLockup = artifacts.require("./KudosTokenLockup.sol");

module.exports = function(deployer) {
   deployer.deploy(SafeMath);
   deployer.link(SafeMath, KudosTokenLockup);

   var tokenContractAddress = '';
   var beneficiary = '';

   deployer.deploy(KudosTokenLockup, tokenContractAddress, beneficiary);
};
