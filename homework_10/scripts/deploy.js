// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");

// const provider = new ethers.providers.getDefaultProvider("rinkeby");
const provider = new ethers.providers.WebSocketProvider("ws://127.0.0.1:8545");

async function deployContract() {
  const volcanoContract = await ethers.getContractFactory("VolcanoCoin");

  const contract = await volcanoContract.deploy(); 

  await contract.deployed();

  console.log("contract addr:", contract.address);
  let name = await contract.name();

  console.log("name:", name);
}

deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
