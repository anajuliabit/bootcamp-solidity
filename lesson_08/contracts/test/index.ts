import { assert } from "chai";
import { ethers } from "hardhat";

describe("VolcanoCoin", function () {
  it("Should return the new greeting once it's changed", async function () {
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const deploy = await VolcanoCoin.deploy();
    const response = await deploy.deployed();
    console.log(response);

    assert.notEqual(deploy.address, null);
  });
});
