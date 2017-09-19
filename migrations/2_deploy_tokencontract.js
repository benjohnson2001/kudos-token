var SafeMath = artifacts.require("./SafeMath.sol");
var KudosToken = artifacts.require("./KudosToken.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, KudosToken);
  deployer.deploy(KudosToken);
};
