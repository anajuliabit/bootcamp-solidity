// SPDX-License-Identifier: UNLICENSED
// Version of Solidity compiler this program was written for
pragma solidity ^0.8.0;

contract VolcanoCoin {
    
    uint256 total_supply;
    address owner;    
    mapping(address => uint256) public balances;
    mapping(address => Payment[]) payments;
     
    event NewSupply(uint256 _newSupply);
    event Transfer(address recipient, uint256 amount);
    
    struct Payment {
      address recipient;
      uint256 amount;
    }
    
    modifier onlyOwner {
      if(msg.sender == owner) {
          _;
      }
    }
     
    constructor() {
      owner = msg.sender;
      total_supply = 10000;
      balances[owner] = total_supply;
    }
     
    function increaseSupply() public onlyOwner {
      total_supply += 1000;
      balances[owner] += 1000;
      emit NewSupply(total_supply);
    }
    
    function transfer(address _recipient, uint256 _amount) public {
      require(balances[msg.sender] >= _amount, "Insufficient funds");
      balances[msg.sender] -= _amount;
      balances[_recipient] += _amount;
    
      payments[msg.sender].push(Payment({ recipient: _recipient, amount: _amount}));
  
      emit Transfer(_recipient, _amount);
    }
    
    function getPayments(address _sender) public view returns(Payment[] memory) {
      return payments[_sender];
    }
}