var SafeMath = artifacts.require("./SafeMath.sol");
var KudosTokenPresale = artifacts.require("./KudosTokenPresale.sol");

module.exports = function(deployer) {
   deployer.deploy(SafeMath);
   deployer.link(SafeMath, KudosTokenPresale);
   deployer.deploy(KudosTokenPresale, '0x262166be206266260e0c000d58be56a48e82f84e');
};
