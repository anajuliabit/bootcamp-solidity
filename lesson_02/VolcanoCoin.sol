// SPDX-License-Identifier: UNLICENSED
// Version of Solidity compiler this program was written for
pragma solidity ^0.8.0;

contract VolcanoCoin {
    
    uint total_supply;
    address owner;
     
    event NewSupply(uint _newSupply);
     
    modifier onlyOwner {
      if(msg.sender == owner) {
          _;
      }
    }
     
    constructor() {
      owner = msg.sender;
      total_supply = 10000;
    }
     
    function increaseSupply() public onlyOwner {
      total_supply += 1000;
      emit NewSupply(total_supply);
    }

}