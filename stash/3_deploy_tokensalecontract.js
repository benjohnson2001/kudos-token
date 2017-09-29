var SafeMath = artifacts.require("./SafeMath.sol");
var KudosTokenSale = artifacts.require("./KudosTokenSale.sol");

module.exports = function(deployer) {
   deployer.deploy(SafeMath);
   deployer.link(SafeMath, KudosTokenSale);

   var wallet = '';
   var startTime = 1509541200;
   var tokenContractAddress = '';

   deployer.deploy(KudosTokenSale, wallet, startTime, tokenContractAddress);
};
