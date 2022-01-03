// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract DeFi {
  address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F; 
  address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
  
  ISwapRouter public immutable swapRouter;

  constructor() {
    swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);  
  }

  function swapDAItoUSDC(uint256 _amountIn) public returns (uint256 amountOut) {
    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
      tokenIn: DAI,
      tokenOut: USDC,
      fee: 3000,
      recipient: msg.sender, 
      deadline: block.timestamp, 
      amountIn: _amountIn, 
      amountOutMinimum: 0, 
      sqrtPriceLimitX96: 0
    });

    TransferHelper.safeApprove(DAI, address(swapRouter), _amountIn);
    amountOut = swapRouter.exactInputSingle(params);
  }

  function swapTokens(address tokenIn, address tokenOut, uint256 amountIn) public returns(uint256){ 
    ISwapRouter.ExactInputSingleParams memory params = 
        ISwapRouter.ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: 3000,
            recipient: msg.sender,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });
    
    TransferHelper.safeApprove(tokenIn, address(swapRouter), amountIn);
    uint256 amountOut = swapRouter.exactInputSingle(params);

    return amountOut;
  }

}
