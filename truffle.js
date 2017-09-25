require('babel-register');
require('babel-polyfill');

module.exports = {
   networks: {
      development: {
         host: "localhost",
         port: 8545,
         network_id: "*" // Match any network id
      },
      coverage: {
         host: "localhost",
         network_id: "*",
         port: 8555,
         gas: 0xfffffffffff,
         gasPrice: 0x01
      },
      testnet: {
         host: "localhost",
         port: 8545,
         network_id: 4,
         from: "0x4F3Da41D2adb81e8e3A808E865b55c68f163b81A",
         // from: "0x8550b1cc5914909d75c12708b92049ab78b52ffe",
         gas: 4612388
      },
      production: {
         host: "localhost",
         port: 8545,
         network_id: 1
      }
   }
};
