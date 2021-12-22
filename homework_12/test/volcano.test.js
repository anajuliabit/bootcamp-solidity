require('@openzeppelin/hardhat-upgrades');
const { expect, use, assert } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;
const {
  constants, // Common constants, like the zero address and largest integers
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");
const { solidity } = require("ethereum-waffle");

use(solidity);

const AMOUNT = 100;

// https://www.chaijs.com/guide/styles/
// https://ethereum-waffle.readthedocs.io/en/latest/matchers.html

describe("Volcano Coin", () => {
  it("v1", async () => {
    const Volcano = await ethers.getContractFactory("contracts/VolcanoCoin.sol:VolcanoCoin");
      const instance = await upgrades.deployProxy(Volcano, ['http://localhost:3000']); 
      await instance.deployed()
  
      const version = await instance.version();
      expect(version).to.equal("1");
    });

  it('v2', async () => {
    const Volcano = await ethers.getContractFactory("contracts/VolcanoCoin.sol:VolcanoCoin");
    const VolcanoV2 = await ethers.getContractFactory("contracts/VolcanoCoinV2.sol:VolcanoCoin");
    
    const instance = await upgrades.deployProxy(Volcano, ['http://localhost:3000']); 
    const upgraded = await upgrades.upgradeProxy(instance.address, VolcanoV2);

    const version = await upgraded.version();
    expect(version).to.equal('2');

  });

  
});
