// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");

// const provider = new ethers.providers.getDefaultProvider("rinkeby");
const provider = new ethers.providers.WebSocketProvider("ws://127.0.0.1:8545");
const V1_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

async function deployContract() {
  const VolcanoContract = await ethers.getContractFactory("contracts/VolcanoCoin.sol:VolcanoCoin");
  const instance = await upgrades.deployProxy(VolcanoContract, ['http://localhost:3000']); 

  const VolcanoContractV2 = await ethers.getContractFactory("contracts/VolcanoCoinV2.sol:VolcanoCoin");

  const upgraded = await upgrades.upgradeProxy(instance.address, VolcanoContractV2); 
  console.log("contract addr:", upgraded.address);
}

deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
