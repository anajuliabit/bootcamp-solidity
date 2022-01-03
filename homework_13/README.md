## Hardhat 

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
```

## Fork mainnet using ganache-cli

Go to https://infura.io/ and create a new project and select Ethereum as the product. In the project's settings,find the endpoints for mainnet. Copy the https API key. You're going to connect to the Infura node to fork the mainnet.

Run `$ npx ganache-cli --fork https://mainnet.infura.io/v3/{infura_project_id}` --unlock 0x503828976D22510aad0201ac7EC88293211D23Da 

If local port is not 8545 add -p {port_number}`
