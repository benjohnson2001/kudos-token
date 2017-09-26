import ether from './helpers/ether'
import {advanceBlock} from './helpers/advanceToBlock'
import {increaseTimeTo, duration} from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import EVMThrow from './helpers/EVMThrow'


const BigNumber = web3.BigNumber

const should = require('chai')
   .use(require('chai-as-promised'))
   .use(require('chai-bignumber')(BigNumber))
   .should()

const KudosToken = artifacts.require('KudosToken');
const KudosTokenSale = artifacts.require('KudosTokenSale');

contract('KudosTokenSaleTest1', function () {

   var startTime;
   var endTime;
   var afterEndTime;

   var token;
   var crowdsale;
   var owner;

   before(async function() {
     //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
     await advanceBlock()
   })

   beforeEach(async function() {

      startTime = latestTime() + duration.weeks(1);
      endTime = startTime + duration.days(7);
      afterEndTime = endTime + duration.seconds(1)

      token = await KudosToken.new();
      crowdsale = await KudosTokenSale.new(startTime, token.address);
      owner = await token.owner();
   })

   it('funded crowdsale: tokensAreAvailable should return true', async function () {

      var amountOfTokensForSale = await crowdsale.amountOfTokensForSale();
      token.transfer(crowdsale.address, amountOfTokensForSale);

      var tokensAreAvailable = await crowdsale.tokensAreAvailable();
      tokensAreAvailable.should.equal(true);
   })

   it('funded crowdsale: should not be active before the start time', async function () {

      var amountOfTokensForSale = await crowdsale.amountOfTokensForSale();
      token.transfer(crowdsale.address, amountOfTokensForSale);

      var isAfterStartTime = await crowdsale.isAfterStartTime();
      isAfterStartTime.should.equal(false);

      var isBeforeEndTime = await crowdsale.isBeforeEndTime();
      isBeforeEndTime.should.equal(true);

      var crowdsaleIsActive = await crowdsale.isActive();
      crowdsaleIsActive.should.equal(false);
   })

   it('funded crowdsale: should be active after the start time and before the end time', async function () {

      var amountOfTokensForSale = await crowdsale.amountOfTokensForSale();
      token.transfer(crowdsale.address, amountOfTokensForSale);

      // https://github.com/ethereumjs/testrpc/issues/336
      await crowdsale.isBeforeEndTime();
      await increaseTimeTo(startTime);
      await crowdsale.isBeforeEndTime();

      var isAfterStartTime = await crowdsale.isAfterStartTime();
      isAfterStartTime.should.equal(true);

      var isBeforeEndTime = await crowdsale.isBeforeEndTime();
      isBeforeEndTime.should.equal(true);

      var crowdsaleIsActive = await crowdsale.isActive();
      crowdsaleIsActive.should.equal(true);
   })

   it('funded crowdsale: should not be active after the end time', async function () {

      var amountOfTokensForSale = await crowdsale.amountOfTokensForSale();
      token.transfer(crowdsale.address, amountOfTokensForSale);

      // https://github.com/ethereumjs/testrpc/issues/336
      await crowdsale.isBeforeEndTime();
      await increaseTimeTo(afterEndTime);
      await crowdsale.isBeforeEndTime();

      var isAfterStartTime = await crowdsale.isAfterStartTime();
      isAfterStartTime.should.equal(true);

      var isBeforeEndTime = await crowdsale.isBeforeEndTime();
      isBeforeEndTime.should.equal(false);

      var crowdsaleIsActive = await crowdsale.isActive();
      crowdsaleIsActive.should.equal(false);
   })

   it('unfunded crowdsale: tokensAreAvailable should return false', async function () {

      var tokensAreAvailable = await crowdsale.tokensAreAvailable();
      tokensAreAvailable.should.equal(false);
   })

   it('unfunded crowdsale: should not be active before the start time', async function () {

      var isAfterStartTime = await crowdsale.isAfterStartTime();
      isAfterStartTime.should.equal(false);

      var isBeforeEndTime = await crowdsale.isBeforeEndTime();
      isBeforeEndTime.should.equal(true);

      var crowdsaleIsActive = await crowdsale.isActive();
      crowdsaleIsActive.should.equal(false);
   })

   it('unfunded crowdsale: should not be active after the start time and before the end time', async function () {

      // https://github.com/ethereumjs/testrpc/issues/336
      await crowdsale.isBeforeEndTime();
      await increaseTimeTo(startTime);
      await crowdsale.isBeforeEndTime();

      var isAfterStartTime = await crowdsale.isAfterStartTime();
      isAfterStartTime.should.equal(true);

      var isBeforeEndTime = await crowdsale.isBeforeEndTime();
      isBeforeEndTime.should.equal(true);

      var crowdsaleIsActive = await crowdsale.isActive();
      crowdsaleIsActive.should.equal(false);
   })

   it('unfunded crowdsale: should not be active after the end time', async function () {

      // https://github.com/ethereumjs/testrpc/issues/336
      await crowdsale.isBeforeEndTime();
      await increaseTimeTo(afterEndTime);
      await crowdsale.isBeforeEndTime();

      var isAfterStartTime = await crowdsale.isAfterStartTime();
      isAfterStartTime.should.equal(true);

      var isBeforeEndTime = await crowdsale.isBeforeEndTime();
      isBeforeEndTime.should.equal(false);

      var crowdsaleIsActive = await crowdsale.isActive();
      crowdsaleIsActive.should.equal(false);
   })
})
