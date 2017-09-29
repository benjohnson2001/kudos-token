## [Kudos][kudos] Token Contracts

![Kudos](kudos.jpg)

Kudos is a rewards and performance driven currency built on top of the [Ethereum][ethereum] blockchain. Kudos is the fastest and easiest way to rate and equitably reward both users and workers. By leveraging the blockchain to achieve complete transparency, Kudos restores trust in ratings through cryptographically verified transactions that cannot be manipulated by ads or algorithms.

The Kudos token contracts are written in [Solidity][solidity] and tested using [Truffle][truffle] and [testrpc][testrpc].

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

[kudos]: https://www.kudosproject.com/
[ethereum]: https://www.ethereum.org/

[solidity]: https://solidity.readthedocs.io/en/develop/
[truffle]: http://truffleframework.com/
[testrpc]: https://github.com/ethereumjs/testrpc
