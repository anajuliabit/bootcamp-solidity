//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface CERC20 {
  function mint(uint256) external returns (uint256);

  function exchangeRateCurrent() external returns (uint256);

  function supplyRatePerBlock() external returns (uint256);

  function redeem(uint256) external returns (uint256);

  function redeemUnderlying(uint256) external returns (uint256);

  function balanceOf(address owner) external view returns (uint256);

  function decimals() external view returns (uint8);
}
