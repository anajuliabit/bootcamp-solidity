const { expect, use } = require("chai");
const { ethers } = require("hardhat");

const { solidity } = require("ethereum-waffle");
use(solidity);

const DAIAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

describe("DeFi", () => {
  const INITIAL_AMOUNT = "100";


  let owner, whale;
  let DAI_TokenContract, USDC_TokenContract, DeFi_Instance;
  let DAI_decimals, USDC_decimals;

  before(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    whale = await ethers.getSigner(
      "0x503828976D22510aad0201ac7EC88293211D23Da"
    );
    console.log("owner account is ", owner.address);

    DAI_TokenContract = await ethers.getContractAt("ERC20", DAIAddress);
    USDC_TokenContract = await ethers.getContractAt("ERC20", USDCAddress);

    DAI_decimals = await DAI_TokenContract.decimals();
    USDC_decimals = await USDC_TokenContract.decimals();
    
    const DeFi = await ethers.getContractFactory("DeFi");
    DeFi_Instance = await DeFi.deploy();
  });

  it("should transfer from whale to owner succeeded", async () => {
    const initialBalance = await DAI_TokenContract.balanceOf(owner.address);

    await DAI_TokenContract.connect(whale).transfer(
      owner.address,
      ethers.utils.parseUnits(INITIAL_AMOUNT, DAI_decimals)
    );

    const balanceAfter = await DAI_TokenContract.balanceOf(owner.address);
    expect(balanceAfter.sub(initialBalance)).to.be.equal(ethers.utils.parseUnits(INITIAL_AMOUNT, DAI_decimals));
  });

  it("should send DAI to contract and check transfer succeeded", async () => {
    const balanceBefore = await DAI_TokenContract.balanceOf(DeFi_Instance.address);

    const transferValue = ethers.utils.parseUnits(INITIAL_AMOUNT, DAI_decimals)
    await DAI_TokenContract.connect(whale).transfer(
      DeFi_Instance.address,
      transferValue
    );

    const balanceAfter = await DAI_TokenContract.balanceOf(DeFi_Instance.address);
    expect(balanceAfter.sub(balanceBefore)).to.be.equal(transferValue);
  });

  it("should swap DAI for USDC", async () => {
    let USDCbalanceBefore = await USDC_TokenContract.balanceOf(owner.address);

    const transferValue = ethers.utils.parseUnits("1", DAI_decimals);
    const tx = await DeFi_Instance.connect(owner).swapDAItoUSDC(transferValue);
    await tx.wait();

    let USDCbalanceAfter = await USDC_TokenContract.balanceOf(owner.address);
    expect(Number(USDCbalanceAfter.sub(USDCbalanceBefore))).to.be.greaterThan(0);
  });

  it("should swap DAI for UNI", async () => {
    const UNI_TokenContract = await ethers.getContractAt(
      "ERC20",
      "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
    );
    const UNIbalanceBefore = await UNI_TokenContract.balanceOf(owner.address);
    const transferValue = ethers.utils.parseUnits("1", DAI_decimals);

    const tx = await DeFi_Instance.connect(owner).swapTokens(
      DAI_TokenContract.address,
      UNI_TokenContract.address,
      transferValue
    );
    await tx.wait();

    const UNIbalanceAfter = await UNI_TokenContract.balanceOf(owner.address);
    expect(Number(UNIbalanceAfter.sub(UNIbalanceBefore))).to.be.greaterThan(0);
  });
});
