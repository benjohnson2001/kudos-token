var SafeMath = artifacts.require("./SafeMath.sol");
var KudosTokenPresale = artifacts.require("./KudosTokenPresale.sol");

module.exports = function(deployer) {
   deployer.deploy(SafeMath);
   deployer.link(SafeMath, KudosTokenPresale);
   deployer.deploy(KudosTokenPresale, '0x271e17363ec94929d79c06413a2d2a8a23a876e0');
};
