const { expect, use, assert } = require("chai");
const { ethers } = require("hardhat");
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
  let volcanoContract;
  let owner, addr1, addr2, addr3;

  beforeEach(async () => {
    const Volcano = await ethers.getContractFactory("VolcanoCoin");
    volcanoContract = await Volcano.deploy();
    await volcanoContract.deployed();

    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("has a name", async () => {
    let contractName = await volcanoContract.name();
    expect(contractName).to.equal("Volcano Coin");
  });

  it("reverts when transferring tokens to the zero address", async () => {
    await expectRevert(
      volcanoContract.transfer(constants.ZERO_ADDRESS, 10),
      "ERC20: transfer to the zero address"
    );
  });

  //homework
  it("has a symbol", async () => {
    let contractName = await volcanoContract.symbol();
    expect(contractName).to.equal("VLC");
  });

  it("has 18 decimals", async () => {
    let contractName = await volcanoContract.decimals();
    expect(contractName).to.equal(18);
  });

  it("assigns initial balance", async () => {
    let balance = await volcanoContract.balanceOf(owner.address);
    expect(balance).to.equal(100000);
  });

  it("increases allowance for address1", async () => {
    await volcanoContract.increaseAllowance(addr1.address, AMOUNT);
    let finalAllowance = await volcanoContract.allowance(
      owner.address,
      addr1.address
    );

    assert.equal(
      AMOUNT,
      Number(finalAllowance),
      "Final allowance and amount should be equal"
    );
    assert.notEqual(0, finalAllowance, "Final allowance should not be zero");
  });

  it("decreases allowance for address1", async () => {
    await volcanoContract.approve(addr1.address, AMOUNT);
    let startingAllowance = await volcanoContract.allowance(
      owner.address,
      addr1.address
    );

    const decrease = await volcanoContract.decreaseAllowance(
      addr1.address,
      AMOUNT
    );
    await decrease.wait();

    let finalAllowance = await volcanoContract.allowance(
      owner.address,
      addr1.address
    );
    finalAllowance = Number(finalAllowance);

    expect(finalAllowance).to.equal(0);
    assert.equal(
      finalAllowance,
      startingAllowance - AMOUNT,
      "Allowance and amount not equal"
    );
    assert.notEqual(
      finalAllowance,
      startingAllowance,
      "The allowance shouldn't be equal to the starting allowance"
    );
  });

  it("emits an event when increasing allowance", async () => {
    const response = await volcanoContract.increaseAllowance(
      addr1.address,
      AMOUNT
    );
    const { events } = await response.wait();

    expect(events).to.have.length(1);
    expect(events[0].event).to.equal("Approval");
    expect(events[0].args.owner).to.equal(owner.address);
    expect(events[0].args.spender).to.equal(addr1.address);
    expect(events[0].args.value).to.equal(AMOUNT);
  });

  it("reverts decreaseAllowance when trying decrease below 0", async () => {
    // inital allowance = 0, will try to decrease by 1. 0 - 1 = error
    await expectRevert(
      volcanoContract.decreaseAllowance(addr1.address, 1),
      "ERC20: decreased allowance below zero"
    );
  });

  it("updates balances on successful transfer from owner to addr1", async () => {
    await volcanoContract.transfer(addr1.address, AMOUNT);

    const balanceOwner = await volcanoContract.balanceOf(owner.address);
    const balanceAddr1 = await volcanoContract.balanceOf(addr1.address);

    expect(balanceOwner).to.equal(99900);
    expect(balanceAddr1).to.equal(AMOUNT);
  });

  it("revets transfer when sender does not have enough balance", async () => {
    await expectRevert(
      volcanoContract.transfer(addr1.address, 100001),
      "ERC20: transfer amount exceeds balance"
    );
  });

  it("reverts transferFrom addr1 to addr2 called by the owner without setting allowance", async () => {
    await volcanoContract.transfer(addr1.address, AMOUNT);
    await expectRevert(
      volcanoContract.transferFrom(addr1.address, addr2.address, AMOUNT),
      "ERC20: transfer amount exceeds allowance"
    );
  });

  it("updates balances after transferFrom addr1 to addr2 called by the owner", async () => {
    await volcanoContract.transfer(addr1.address, AMOUNT);
    await volcanoContract.connect(addr1).approve(owner.address, AMOUNT);
    await volcanoContract.transferFrom(addr1.address, addr2.address, AMOUNT);

    const balanceAddr1 = await volcanoContract.balanceOf(addr1.address);
    const balanceAddr2 = await volcanoContract.balanceOf(addr2.address);

    expect(balanceAddr1).to.equal(0);
    expect(balanceAddr2).to.equal(AMOUNT);
  });
});
