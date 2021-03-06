const KudosToken = artifacts.require("KudosToken");

contract('KudosToken', function(accounts) {
  it("the token contract should put 10000000000.000000000000000000 Kudos tokens in the owner account", function() {
    return KudosToken.deployed().then(function(instance) {
      return instance.balanceOf.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 10000000000000000000000000000, "10000000000.000000000000000000 wasn't in the first account");
    });
  });

  it("the token contract should transfer tokens correctly", function() {
    var kudosToken;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return KudosToken.deployed().then(function(instance) {
      kudosToken = instance;
      return kudosToken.balanceOf.call(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return kudosToken.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return kudosToken.transfer(account_two, amount, {from: account_one});
    }).then(function() {
      return kudosToken.balanceOf.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return kudosToken.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });
});
