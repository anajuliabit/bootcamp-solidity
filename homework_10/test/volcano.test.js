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
  let volcanoContract;
  let owner, addr1, addr2, addr3;

  beforeEach(async () => {
    const Volcano = await ethers.getContractFactory("VolcanoCoin");
    volcanoContract = await Volcano.deploy();
    await volcanoContract.deployed();

    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("should get the payments of a user", async () => {
    await volcanoContract.transfer(addr1.address, 100);
    const payments = await volcanoContract.getPayments(owner.address);
    expect(payments[0].amount.toNumber()).to.equal(ethers.BigNumber.from("100").toNumber());
  });

  it("update payment record", async () => {
    await volcanoContract.transfer(addr1.address, 100);
    const addr1Connection = await volcanoContract.connect(addr1);
    await addr1Connection.transfer(addr2.address, 100);
    await addr1Connection.updatePayment(0, 2, "This is a comment");

    const paymentsAfter = await volcanoContract.getPayments(addr1.address);

    expect(paymentsAfter[0].comment).to.equal('This is a comment');
    expect(paymentsAfter[0].type_payment).to.equal(2);
  });

  it("update payment record by admin", async () => {
    await volcanoContract.transfer(addr1.address, 100);
    const addr1Connection = await volcanoContract.connect(addr1);
    await addr1Connection.transfer(addr2.address, 100);
    await volcanoContract.updatePaymentAdmin(addr1.address, 0, 2, "This is a comment");

    const paymentsAfter = await volcanoContract.getPayments(addr1.address);

    expect(paymentsAfter[0].comment).to.equal(`This is a comment update by ${owner.address.split("0x")[1].toLowerCase()}`);
    expect(paymentsAfter[0].type_payment).to.equal(2);
  });
});
