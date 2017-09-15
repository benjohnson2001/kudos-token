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
         from: "0x4f3da41d2adb81e8e3a808e865b55c68f163b81a",
         gas: 4612388
      },
      production: {
         host: "localhost",
         port: 8545,
         network_id: 1
      }
   }
};
