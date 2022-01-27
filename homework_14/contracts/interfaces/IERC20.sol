//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface ERC20 {
  function approve(address, uint256) external returns (bool);

  function transfer(address, uint256) external returns (bool);

  function decimals() external view returns (uint8);

  function balanceOf(address) external view returns (uint256);
}
