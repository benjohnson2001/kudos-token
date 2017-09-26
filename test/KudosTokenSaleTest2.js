import ether from './helpers/ether'
import {advanceBlock} from './helpers/advanceToBlock'
import {increaseTimeTo, duration} from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import EVMThrow from './helpers/EVMThrow'
import expectRevert from './helpers/expectRevert';


const BigNumber = web3.BigNumber

const should = require('chai')
   .use(require('chai-as-promised'))
   .use(require('chai-bignumber')(BigNumber))
   .should()

const KudosToken = artifacts.require('KudosToken');
const KudosTokenSale = artifacts.require('KudosTokenSale');

contract('KudosTokenSaleTest2', function ([deployer, wallet, purchaser]) {

   var now;
   var startTime;
   var endTime;
   var afterEndTime;

   var token;
   var tokenSale;

   const value = ether(42);

   const ethPriceInDollars = 287;
   const tokenUnit = 10 ** 18;
   const oneMillion = 10 ** 6;
   const oneBillion = 10 ** 9;
   const amountOfTokensForSale = 4 * oneBillion * tokenUnit;

   const goalInDollars = 30 * oneMillion;
   const kutoasPerDollar = amountOfTokensForSale/goalInDollars;

   const weiPerDollar = tokenUnit / ethPriceInDollars;
   const kutoasPerWei = parseInt(kutoasPerDollar / weiPerDollar);

   before(async function() {
     //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
     await advanceBlock()
   })

   beforeEach(async function() {

      now = latestTime();
      startTime = now + duration.weeks(1);
      endTime = startTime + duration.days(7);
      afterEndTime = endTime + duration.seconds(1)

      token = await KudosToken.new();
   })

   describe('construction', async () => {

      it('should not allow to initialize with null wallet address', async () => {
         await expectRevert(KudosTokenSale.new(null, now + 100, token.address));
      });

      it('should not allow to initialize with 0 wallet address', async () => {
         await expectRevert(KudosTokenSale.new(0, now + 100, token.address));
      });

      it('should be initialized with a future starting time', async () => {
         await expectRevert(KudosTokenSale.new(wallet, now - 100, token.address));
      });

      it('should not allow to initialize with null token contract address', async () => {
         await expectRevert(KudosTokenSale.new(wallet, now + 100, null));
      });

      it('should not allow to initialize with 0 token contract address', async () => {
         await expectRevert(KudosTokenSale.new(wallet, now + 100, 0));
      });

      it('should be ownable', async () => {
         let sale = await KudosTokenSale.new(wallet, now + 10000, token.address);
         assert.equal(await sale.owner(), deployer);
      });
   });
})
