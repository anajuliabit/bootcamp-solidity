// SPDX-License-Identifier: UNLICENSED
// Version of Solidity compiler this program was written for
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VolcanoCoin is ERC20, Ownable  {
    
    uint256 total_supply;
    mapping(address => Payment[]) payments;
     
    event NewSupply(uint256 _newSupply);
    
    struct Payment {
      address recipient;
      uint256 amount;
    }
     
    constructor() ERC20("VolcanoCoin", "VOLC") {
      total_supply = 10000;
      _mint(_msgSender(), 10000);
    }
     
    function mint(address _account, uint256 _amount) public onlyOwner {
      _mint(_account, _amount);
      total_supply += _amount;
      
      emit NewSupply(total_supply);
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