## [Kudos][kudos] Token Contracts

![Kudos](kudos.jpg)

Kudos is a rewards and performance driven currency built on top of the [Ethereum][ethereum] blockchain. Kudos is the fastest and easiest way to rate and equitably reward both users and workers. By leveraging the blockchain to achieve complete transparency, Kudos restores trust in ratings through cryptographically verified transactions that cannot be manipulated by ads or algorithms.

The Kudos token contracts are written in [Solidity][solidity] and tested using [truffle][truffle] and [testrpc][testrpc].

#### Dependencies

```bash
# install truffle and testrpc packages globally
$ npm install -g truffle ethereumjs-testrpc

# install local node dependencies in project directory
$ npm install
```

#### Run Tests

```bash
# run testrpc instance (make sure no other ethereum clients are running)
$ ./scripts/testrpc.sh

# run smart contract tests
$ truffle test
```

#### Generate Code Coverage Report

```bash
# run solidity-coverage tool
$ ./scripts/coverage.sh

# view report at ./coverage/index.html
```

## launch sequence 🚀

1. deploy the KudosToken contract with `truffle deploy`

2. move the `stash/3_deploy_tokensalecontract.js` migration script to the `migrations` folder

3. in the `migrations/3_deploy_tokensalecontract.js` file:

   - specify the wallet address that will receive ETH in the crowdsale in the `wallet` variable

   - specify the address of the deployed token contract in the `tokenContractAddress` variable

4. deploy the KudosTokenSale contract with `truffle deploy`

5. fund the crowdsale contract with the Kudos tokens created in step 1, the amount should match the `amountOfTokensForSale` variable in the KudosTokenSale contract

   for example, in `truffle console`:
```bash
> KudosToken.deployed().then(function(instance) { token = instance});
> KudosTokenSale.deployed().then(function(instance) { sale = instance});
> token.transfer(sale.address, web3.toWei('4000000000', 'ether'));
```

6. whitelist users for each tier with the `registerTier1Users` and `registerTier2Users` functions, remove users from the whitelist with the `unregisterUsers` function


[kudos]: https://www.kudosproject.com/
[ethereum]: https://www.ethereum.org/

[solidity]: https://solidity.readthedocs.io/en/develop/
[truffle]: http://truffleframework.com/
[testrpc]: https://github.com/ethereumjs/testrpc
