// SPDX-License-Identifier: UNLICENSED
// Version of Solidity compiler this program was written for
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VolcanoCoin is ERC20, Ownable  {
    
    mapping(address => Payment[]) payments;s     
    
    struct Payment {
      address recipient;
      uint256 amount;
    }
     
    constructor() ERC20("VolcanoCoin", "VOLC") {
      _mint(_msgSender(), 10000);
    }
     
    function mintToOwner(uint256 _amount) public onlyOwner {
      _mint(_msgSender(), _amount);
    }
    
    function transfer(address recipient, uint256 amount) public override returns (bool) {
      _transfer(_msgSender(), recipient, amount);
      
      addPayment(_msgSender(), recipient, amount);
      return true;
    }
    
    function addPayment(address _sender, address _receiver, uint256 _amount) internal {
      payments[_sender].push(Payment({ recipient: _receiver, amount: _amount}));
    }

    function getPayments(address _sender) public view returns(Payment[] memory) {
      return payments[_sender];
    }
}