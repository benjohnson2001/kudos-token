var SafeMath = artifacts.require("./SafeMath.sol");
var FunnyTokenSale = artifacts.require("./FunnyTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, FunnyTokenSale);
  deployer.deploy(FunnyTokenSale, '0xb213877c12230d07def539434ddac2f4edfb9318');
};
