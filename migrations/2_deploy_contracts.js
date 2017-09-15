var SafeMath = artifacts.require("./SafeMath.sol");
var FunnyToken = artifacts.require("./FunnyToken.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, FunnyToken);
  deployer.deploy(FunnyToken);
};
