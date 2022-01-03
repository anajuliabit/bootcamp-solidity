const { expect, use } = require("chai");
const { ethers } = require("hardhat");

const { solidity } = require("ethereum-waffle");
use(solidity);

const DAIAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

describe("DeFi", () => {
  let owner;
  let DAI_TokenContract;
  let USDC_TokenContract;
  let DeFi_Instance;
  const INITIAL_AMOUNT = 999999999000000;

  before(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    const whale = await ethers.getSigner(
      "0x503828976D22510aad0201ac7EC88293211D23Da"
    );
    console.log("owner account is ", owner.address);

    DAI_TokenContract = await ethers.getContractAt("ERC20", DAIAddress);
    USDC_TokenContract = await ethers.getContractAt("ERC20", USDCAddress);
    const symbol = await DAI_TokenContract.symbol();
    const DeFi = await ethers.getContractFactory("DeFi");

    await DAI_TokenContract.connect(whale).transfer(
      owner.address,
      BigInt(INITIAL_AMOUNT + 1000000)
    );

    DeFi_Instance = await DeFi.deploy();
  });

  it("should check transfer succeeded", async () => {
    let balance = await DAI_TokenContract.balanceOf(owner.address);
    expect(balance).to.be.at.least(INITIAL_AMOUNT);
  });

  it("should send DAI to contract and check transfer succeeded", async () => {
    const tx = await DAI_TokenContract.connect(owner).transfer(
      DeFi_Instance.address,
      INITIAL_AMOUNT
    );
    const balance = await DAI_TokenContract.balanceOf(DeFi_Instance.address);
    expect(balance).to.equal(INITIAL_AMOUNT);
  });
  
  it("should make a swap", async () => {
    let USDCbalanceBefore = await USDC_TokenContract.balanceOf(owner.address);
    tx = await DeFi_Instance.connect(owner).swapDAItoUSDC(INITIAL_AMOUNT);
    await tx.wait();
    let USDCbalanceAfter = await USDC_TokenContract.balanceOf(owner.address);
  });

  it("should swap Dai for UNI", async () => {
    UNI_TokenContract = await ethers.getContractAt("ERC20", "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984");
    let UNIbalanceBefore = await UNI_TokenContract.balanceOf(owner.address);
    let tx1 = await DAI_TokenContract.connect(owner).transfer(
      DeFi_Instance.address,
      INITIAL_AMOUNT
    );
    await tx1.wait();

    let tx2 = await DeFi_Instance.connect(owner).swapTokens(
      DAI_TokenContract.address,
      UNI_TokenContract.address,
      INITIAL_AMOUNT
    );
    await tx2.wait();
    
    let UNIbalanceAfter = await UNI_TokenContract.balanceOf(owner.address);
    expect(UNIbalanceAfter-UNIbalanceBefore).to.be.at.least(1);
  });
});
