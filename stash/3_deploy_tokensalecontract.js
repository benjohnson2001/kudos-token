var SafeMath = artifacts.require("./SafeMath.sol");
var KudosTokenSale = artifacts.require("./KudosTokenSale.sol");

module.exports = function(deployer) {
   deployer.deploy(SafeMath);
   deployer.link(SafeMath, KudosTokenSale);

   var wallet = '0xe702ee34e8e4749f5cab4af574e458693dfc9575';
   var startTime = 1506623400;
   var tokenContractAddress = '0x8a03de909d9b7794cd262c96be961097d7c9d880';

   deployer.deploy(KudosTokenSale, wallet, startTime, tokenContractAddress);
};
