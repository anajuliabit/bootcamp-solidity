import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const DAIAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const cDAIAddress = "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643";

describe("Compound", () => {
  let owner: SignerWithAddress;
  let whale: SignerWithAddress;
  let contract: Contract;
  let daiDecimals: number, cDaiDecimals: number;
  let DaiToken: Contract;
  let cDAIToken: Contract;
  before(async function () {
    [owner] = await ethers.getSigners();
    whale = await ethers.getSigner(
      "0x503828976D22510aad0201ac7EC88293211D23Da"
    );

    const factory = await ethers.getContractFactory("Compound");
    contract = await factory.deploy();
    DaiToken = await ethers.getContractAt("ERC20", DAIAddress);
    cDAIToken = await ethers.getContractAt("CERC20", cDAIAddress);
    daiDecimals = await DaiToken.decimals();
    cDaiDecimals = await cDAIToken.decimals();
  });

  it("should transfer DAI from whale to contract", async () => {
    const balance = await DaiToken.balanceOf(contract.address);
    const amount = ethers.utils.parseUnits("100", daiDecimals);

    await DaiToken.connect(whale).transfer(contract.address, amount);

    const balanceAfter = await DaiToken.balanceOf(contract.address);
    expect(balanceAfter.sub(balance)).to.eq(amount);
  });

  it("should mint cDAI", async () => {
    const amount = ethers.utils.parseUnits("100", cDaiDecimals);
    const tx = await contract.connect(owner).addToCompound(amount);
    await tx.wait();

    const balance = await cDAIToken.balanceOf(contract.address);
    expect(balance).to.be.gte(1);
  });

  it("should get ETH price from chainlink data feed", async () => {
    const tx = await contract.getEthPrice();
    console.log(Number(tx));
  });
});
