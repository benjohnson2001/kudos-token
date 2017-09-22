require('babel-register');
require('babel-polyfill');

module.exports = {
   networks: {
      development: {
         host: "localhost",
         port: 8545,
         network_id: "*" // Match any network id
      },
      testnet: {
         host: "localhost",
         port: 8545,
         network_id: 4,
         from: "0x8550b1cc5914909d75c12708b92049ab78b52ffe",
         gas: 4612388
      },
      production: {
         host: "localhost",
         port: 8545,
         network_id: 1
      }
   }
};
