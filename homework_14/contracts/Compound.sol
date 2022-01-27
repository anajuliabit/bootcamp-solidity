//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interfaces/IERC20.sol";
import "./interfaces/CERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Compound {
  address constant ETHPriceContract =
    0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
  AggregatorV3Interface public aggregator;
  address private DAI;
  address private cDAI;

  ERC20 private immutable tokenDAI;
  CERC20 private immutable tokenCDAI;

  constructor() {
    DAI = address(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    cDAI = address(0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643);
    tokenDAI = ERC20(DAI);
    tokenCDAI = CERC20(cDAI);
    aggregator = AggregatorV3Interface(
      0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
    );
  }

  function addToCompound(uint256 amount) public {
    tokenDAI.approve(cDAI, amount);
    tokenCDAI.mint(amount);
  }

  function getEthPrice() public view returns (int256) {
    (, int256 price, , , ) = aggregator.latestRoundData();
    return price;
  }
}
