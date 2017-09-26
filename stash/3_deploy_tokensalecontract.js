var SafeMath = artifacts.require("./SafeMath.sol");
var KudosTokenSale = artifacts.require("./KudosTokenSale.sol");

module.exports = function(deployer) {
   deployer.deploy(SafeMath);
   deployer.link(SafeMath, KudosTokenSale);

   var wallet = '0x4F3Da41D2adb81e8e3A808E865b55c68f163b81A';
   var startTime = 1508331600;
   var tokenContractAddress = '0x54dd06274f927b722dc0a5578bc5f55f62f700f6';

   deployer.deploy(KudosTokenSale, wallet, startTime, tokenContractAddress);
};
