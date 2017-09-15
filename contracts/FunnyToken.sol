pragma solidity ^0.4.15;

import "./StandardToken.sol";

contract FunnyToken is StandardToken {

   string public constant name = "FunnyToken";
   string public constant symbol = "FT";
   uint8 public constant decimals = 18;
   string public constant version = "1.0";

   function FunnyToken() {

   }
}
