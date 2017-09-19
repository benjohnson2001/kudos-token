var SafeMath = artifacts.require("./SafeMath.sol");
var KudosTokenSale = artifacts.require("./KudosTokenSale.sol");

module.exports = function(deployer) {
   deployer.deploy(SafeMath);
   deployer.link(SafeMath, KudosTokenSale);
   deployer.deploy(KudosTokenSale, '0x54dd06274f927b722dc0a5578bc5f55f62f700f6');
};
