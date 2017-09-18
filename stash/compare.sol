function buyTokens() payable whenTokenSaleIsActive {

   // Calculate tokens to sell
   uint256 weiAmount = msg.value;
   uint256 tokens = weiAmount.mul(RATE);

   BoughtTokens(msg.sender, tokens);

   // Increment raised amount
   raisedAmount = raisedAmount.add(msg.value);

   // Send tokens to buyer
   token.transfer(msg.sender, tokens);

   // Send money to owner
   owner.transfer(msg.value);
}



/// @dev Accepts ether and creates new BAT tokens.
function createTokens() payable external {
  if (isFinalized) throw;
  if (block.number < fundingStartBlock) throw;
  if (block.number > fundingEndBlock) throw;
  if (msg.value == 0) throw;

  uint256 tokens = safeMult(msg.value, tokenExchangeRate); // check that we're not over totals
  uint256 checkedSupply = safeAdd(totalSupply, tokens);

  // return money if something goes wrong
  if (tokenCreationCap < checkedSupply) throw;  // odd fractions won't be found

  totalSupply = checkedSupply;
  balances[msg.sender] += tokens;  // safeAdd not needed; bad semantics to use here
  CreateBAT(msg.sender, tokens);  // logs token creation
}




/// @dev Fallback function that will delegate the request to create().
function () external payable onlyDuringSale {
    create(msg.sender);
}

/// @dev Create and sell tokens to the caller.
/// @param _recipient address The address of the recipient receiving the tokens.
function create(address _recipient) public payable onlyDuringSale {
    require(_recipient != address(0));

    // Enforce participation cap (in Wei received).
    uint256 weiAlreadyParticipated = participationHistory[msg.sender];
    uint256 participationCap = SafeMath.min256(participationCaps[msg.sender], hardParticipationCap);
    uint256 cappedWeiReceived = SafeMath.min256(msg.value, participationCap.sub(weiAlreadyParticipated));
    require(cappedWeiReceived > 0);

    // Accept funds and transfer to funding recipient.
    uint256 weiLeftInSale = MAX_TOKENS_SOLD.sub(tokensSold).div(KIN_PER_WEI);
    uint256 weiToParticipate = SafeMath.min256(cappedWeiReceived, weiLeftInSale);
    participationHistory[msg.sender] = weiAlreadyParticipated.add(weiToParticipate);
    fundingRecipient.transfer(weiToParticipate);

    // Issue tokens and transfer to recipient.
    uint256 tokensLeftInSale = MAX_TOKENS_SOLD.sub(tokensSold);
    uint256 tokensToIssue = weiToParticipate.mul(KIN_PER_WEI);
    if (tokensLeftInSale.sub(tokensToIssue) < KIN_PER_WEI) {
        // If purchase would cause less than KIN_PER_WEI tokens left then nobody could ever buy them.
        // So, gift them to the last buyer.
        tokensToIssue = tokensLeftInSale;
    }
    tokensSold = tokensSold.add(tokensToIssue);
    issueTokens(_recipient, tokensToIssue);

    // Partial refund if full participation not possible
    // e.g. due to cap being reached.
    uint256 refund = msg.value.sub(weiToParticipate);
    if (refund > 0) {
        msg.sender.transfer(refund);
    }
}
