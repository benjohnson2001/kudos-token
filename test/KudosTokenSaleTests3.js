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

contract('KudosTokenSaleTests3', function ([deployer, wallet, purchaser]) {

   var startTime;
   var endTime;
   var afterEndTime;

   var token;
   var tokenSale;

   const value = ether(42);

   const ethPriceInDollars = new BigNumber(300);
   const tokenUnit = new BigNumber(10 ** 18);
   const oneMillion = new BigNumber(10 ** 6);
   const oneBillion = new BigNumber(10 ** 9);
   const amountOfTokensForSale = new BigNumber(4).mul(oneBillion).mul(tokenUnit);

   const goalInDollars = new BigNumber(30).mul(oneMillion);
   const kutoasPerDollar = amountOfTokensForSale.div(goalInDollars);

   const weiPerDollar = tokenUnit.div(ethPriceInDollars);
   const kutoasPerWei = kutoasPerDollar.div(weiPerDollar);

   before(async function() {
     //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
     await advanceBlock()
   })

   beforeEach(async function() {

      startTime = latestTime() + duration.weeks(1);
      endTime = startTime + duration.days(30);
      afterEndTime = endTime + duration.seconds(1)

      token = await KudosToken.new();
      tokenSale = await KudosTokenSale.new(wallet, startTime, token.address);
   })

   async function fundContract() {
      var amountOfTokensForSale = await tokenSale.amountOfTokensForSale();
      await token.transfer(tokenSale.address, amountOfTokensForSale);
   }

   describe('funded tokenSale with unregistered user', function () {

      it('tokens should be available', async function () {

         await fundContract();

         var tokensAreAvailable = await tokenSale.tokensAreAvailable();
         tokensAreAvailable.should.equal(true);
      })

      it('should not be active before start', async function () {

         await fundContract();

         var isAfterStartTime = await tokenSale.isAfterStartTime();
         isAfterStartTime.should.equal(false);

         var isBeforeEndTime = await tokenSale.isBeforeEndTime();
         isBeforeEndTime.should.equal(true);

         var tokenSaleIsActive = await tokenSale.isActive();
         tokenSaleIsActive.should.equal(false);
      })

      it('should be active after start and before end', async function () {

         await fundContract();
         await increaseTimeTo(startTime);

         var isAfterStartTime = await tokenSale.isAfterStartTime();
         isAfterStartTime.should.equal(true);

         var isBeforeEndTime = await tokenSale.isBeforeEndTime();
         isBeforeEndTime.should.equal(true);

         var tokenSaleIsActive = await tokenSale.isActive();
         tokenSaleIsActive.should.equal(true);
      })

      it('should not be active after end', async function () {

         await fundContract();
         await increaseTimeTo(afterEndTime);

         var isAfterStartTime = await tokenSale.isAfterStartTime();
         isAfterStartTime.should.equal(true);

         var isBeforeEndTime = await tokenSale.isBeforeEndTime();
         isBeforeEndTime.should.equal(false);

         var tokenSaleIsActive = await tokenSale.isActive();
         tokenSaleIsActive.should.equal(false);
      })

      it('should reject payments before start', async function () {

         await fundContract();

         await tokenSale.sendTransaction({value: value, from: purchaser}).should.be.rejectedWith(EVMThrow);
         await tokenSale.buyTokens({from: purchaser, value: value}).should.be.rejectedWith(EVMThrow);
      })

      it('should reject payments after start and before end', async function () {

         await fundContract();
         await increaseTimeTo(startTime);

         await tokenSale.sendTransaction({value: value, from: purchaser}).should.be.rejectedWith(EVMThrow);
         await tokenSale.buyTokens({from: purchaser, value: value}).should.be.rejectedWith(EVMThrow);
      })

      it('should reject payments after end', async function () {

         await fundContract();
         await increaseTimeTo(afterEndTime);

         await tokenSale.sendTransaction({value: value, from: purchaser}).should.be.rejectedWith(EVMThrow);
         await tokenSale.buyTokens({value: value, from: purchaser}).should.be.rejectedWith(EVMThrow);
      })
   })

   describe('unfunded tokenSale with unregistered user', function () {

      it('tokens should not be available', async function () {

         var tokensAreAvailable = await tokenSale.tokensAreAvailable();
         tokensAreAvailable.should.equal(false);
      })

      it('should not be active before start', async function () {

         var isAfterStartTime = await tokenSale.isAfterStartTime();
         isAfterStartTime.should.equal(false);

         var isBeforeEndTime = await tokenSale.isBeforeEndTime();
         isBeforeEndTime.should.equal(true);

         var tokenSaleIsActive = await tokenSale.isActive();
         tokenSaleIsActive.should.equal(false);
      })

      it('should not be active after start and before end', async function () {

         await increaseTimeTo(startTime);

         var isAfterStartTime = await tokenSale.isAfterStartTime();
         isAfterStartTime.should.equal(true);

         var isBeforeEndTime = await tokenSale.isBeforeEndTime();
         isBeforeEndTime.should.equal(true);

         var tokenSaleIsActive = await tokenSale.isActive();
         tokenSaleIsActive.should.equal(false);
      })

      it('should not be active after end', async function () {

         await increaseTimeTo(afterEndTime);

         var isAfterStartTime = await tokenSale.isAfterStartTime();
         isAfterStartTime.should.equal(true);

         var isBeforeEndTime = await tokenSale.isBeforeEndTime();
         isBeforeEndTime.should.equal(false);

         var tokenSaleIsActive = await tokenSale.isActive();
         tokenSaleIsActive.should.equal(false);
      })

      it('should reject payments before start', async function () {

         await tokenSale.sendTransaction({value: value, from: purchaser}).should.be.rejectedWith(EVMThrow);
         await tokenSale.buyTokens({from: purchaser, value: value}).should.be.rejectedWith(EVMThrow);
      })

      it('should reject payments after start and before end', async function () {

         await increaseTimeTo(startTime);

         await tokenSale.sendTransaction({value: value, from: purchaser}).should.be.rejectedWith(EVMThrow);
         await tokenSale.buyTokens({value: value, from: purchaser}).should.be.rejectedWith(EVMThrow);
      })

      it('should reject payments after end', async function () {

         await increaseTimeTo(afterEndTime);

         await tokenSale.sendTransaction({value: value, from: purchaser}).should.be.rejectedWith(EVMThrow);
         await tokenSale.buyTokens({value: value, from: purchaser}).should.be.rejectedWith(EVMThrow);
      })
   })

   describe('purchase through fallback function with unregistered user', function () {

      it('should be rejected', async function () {

         await fundContract();
         await increaseTimeTo(startTime);

         await tokenSale.sendTransaction({value: value, from: purchaser}).should.be.rejectedWith(EVMThrow);
      })
   })

   describe('purchase through explicit function call with unregistered user', function () {

      it('should be rejected', async function () {

         await fundContract();
         await increaseTimeTo(startTime);

         await tokenSale.buyTokens({value: value, from: purchaser}).should.be.rejectedWith(EVMThrow);
      })
   })

   describe('token sale that is manually ended', function () {

      it('should transfer remaining tokens to owner', async function () {

         await fundContract();
         await increaseTimeTo(startTime);

         var totalSupply = await token.totalSupply();
         var balance = await token.balanceOf(deployer);
         balance.should.be.bignumber.equal(totalSupply-amountOfTokensForSale)

         await tokenSale.endTokenSale()

         var balance = await token.balanceOf(deployer);
         balance.should.be.bignumber.equal(totalSupply);
      })

      it('should no longer be active', async function () {

         await fundContract();
         await increaseTimeTo(startTime);

         var tokensAreAvailable = await tokenSale.tokensAreAvailable();
         tokensAreAvailable.should.equal(true);

         var tokenSaleIsActive = await tokenSale.isActive();
         tokenSaleIsActive.should.equal(true);

         await tokenSale.endTokenSale()

         var tokensAreAvailable = await tokenSale.tokensAreAvailable();
         tokensAreAvailable.should.equal(false);

         var tokenSaleIsActive = await tokenSale.isActive();
         tokenSaleIsActive.should.equal(false);

         await tokenSale.sendTransaction({value: value, from: purchaser}).should.be.rejectedWith(EVMThrow);
      })

      it('should only be called when there are tokens available', async function () {

         await increaseTimeTo(startTime);
         await tokenSale.endTokenSale().should.be.rejectedWith(EVMThrow);
      })
   })
})
