pragma solidity ^0.4.15;

import "./SafeMath.sol";
import "./ERC20Token.sol";

contract StandardToken is ERC20Token {
   using SafeMath for uint256;

   mapping (address => uint256) balances;
   mapping (address => mapping (address => uint256)) allowed;

   function balanceOf(address _owner) constant returns (uint256 balance) {
      return balances[_owner];
   }

   function transfer(address _to, uint256 _value) returns (bool success) {
      require(_to != address(0));

      // SafeMath.sub will throw if there is not enough balance.
      balances[msg.sender] = balances[msg.sender].sub(_value);
      balances[_to] = balances[_to].add(_value);
      Transfer(msg.sender, _to, _value);
      return true;
   }

   function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
      require(_to != address(0));

      uint256 _allowance = allowed[_from][msg.sender];
      balances[_from] = balances[_from].sub(_value);
      balances[_to] = balances[_to].add(_value);
      allowed[_from][msg.sender] = _allowance.sub(_value);
      Transfer(_from, _to, _value);
      return true;
   }

   function approve(address _spender, uint256 _value) returns (bool success) {

     //  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     require((_value == 0) || (allowed[msg.sender][_spender] == 0));

     allowed[msg.sender][_spender] = _value;
     Approval(msg.sender, _spender, _value);
     return true;
   }

   function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
     return allowed[_owner][_spender];
   }
}
