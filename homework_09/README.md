# Ethers example project

This project demonstrates a basic Hardhat and Ethers.js use case.

Run

```
npm i
npx hardhat node
```

to install required packages and start local blockchain.

For running the tests(separate terminal):

```
npx hardhat test --network hardhat
```

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

# Ether.js

https://docs.ethers.io/v5/

### Providers

A generic API for **account-less** blockchain interaction, regardless of backend

getDefaultProvider() choices randomly 2/5 nodes and validate values - fallback provider

### Signer

A generic API for creating trusted(i.e. signed) **account-based** data
The most common Signers you will encounter are:

Wallet, which is a class which knows its private key and can execute any operations with it
JsonRpcSigner, which is connected to a JsonRpcProvider (or sub-class) and is acquired using getSigner

### Other differences

Human Readable ABI

```
const humanReadableAbi = [
  "function transferFrom(address from, address to, uint value)",
  "function balanceOf(address owner) view returns (uint balance)",
  "event Transfer(address indexed from, address indexed to, address value)"
  ];
```

ENS is a first-class citizen

### Setup

```
npm innit -y
npm install --save-dev hardhat
npx hardhat
npm install --save ethers
npm install --save-dev "hardhat@^2.7.0" "@nomiclabs/hardhat-waffle@^2.0.0" "ethereum-waffle@^3.0.0" "chai@^4.2.0" "@nomiclabs/hardhat-ethers@^2.0.0" "ethers@^5.0.0"

npm install @openzeppelin/contracts
npm install --save-dev @openzeppelin/test-helpers
```

```
npx hardhat node
npx hardhat run scripts/your-script.js --network hardhat
npx hardhat test --network hardhat
```
