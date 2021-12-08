// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");

// const provider = new ethers.providers.getDefaultProvider("rinkeby");
const provider = new ethers.providers.WebSocketProvider("ws://127.0.0.1:8545");

async function basicProvider() {
  let blockNumber = await provider.getBlockNumber();
  console.log("block number", blockNumber);

  let balance = await provider.getBalance(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  );
  console.log(balance);
  balance = ethers.utils.formatEther(balance);
  console.log("balance in eth:", balance);

  let block = await provider.getBlock(blockNumber - 1);
  console.log(block);
}

let myWallet01 = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  provider
);

// myWallet01 = myWallet01.connect(provider);

async function sendingTx() {
  let myAddr = await myWallet01.getAddress();

  console.log("my addr:", myAddr);

  let txResponse = await myWallet01.sendTransaction({
    to: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    value: ethers.utils.parseEther("1"),
  });

  console.log("tx hash", txResponse.hash);

  let txReceipt = await txResponse.wait();
  console.log(txReceipt);
}

async function deployContract() {
  const volcanoContract = await ethers.getContractFactory(
    "VolcanoCoin",
    myWallet01
  );

  const contract = await volcanoContract.deploy(); // pass parameters to you constructor

  await contract.deployed();

  console.log("contract addr:", contract.address);
  let name = await contract.name();

  console.log("name:", name);
}

let myWallet02 = new ethers.Wallet(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  provider
);

async function connectToContract() {
  let contractAddr = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

  const volcanoContract = await ethers.getContractAt(
    "VolcanoCoin",
    contractAddr,
    myWallet01
  );

  let name = await volcanoContract.name();
  console.log("name:", name);

  let ownerBalance = await volcanoContract.balanceOf(myWallet01.address);
  let otherUserBalance = await volcanoContract.balanceOf(myWallet02.address);
  console.log("owner balance:", ownerBalance.toString());
  console.log("other user balance:", otherUserBalance.toString());

  let txResponse = await volcanoContract.transfer(myWallet02.address, 10);
  await txResponse.wait();
  console.log(txResponse.from);

  ownerBalance = await volcanoContract.balanceOf(myWallet01.address);
  otherUserBalance = await volcanoContract.balanceOf(myWallet02.address);
  console.log("owner balance after transfer:", ownerBalance.toString());
  console.log(
    "other user balance after transfer:",
    otherUserBalance.toString()
  );

  let refundTx = await volcanoContract
    .connect(myWallet02)
    .transfer(myWallet01.address, 20);

  await refundTx.wait();

  ownerBalance = await volcanoContract.balanceOf(myWallet01.address);
  otherUserBalance = await volcanoContract.balanceOf(myWallet02.address);
  console.log("owner balance after refund:", ownerBalance.toString());
  console.log("other user balance after refund:", otherUserBalance.toString());
}

// basicProvider()
// sendingTx()
// deployContract()
connectToContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
