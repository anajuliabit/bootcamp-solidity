//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VolcanoCoin is ERC721, Ownable {
  using Counters for Counters.Counter;

  struct Token {
    uint256 tokenId;
    uint256 timestamp;
    string tokenURI;
  }

  string public baseURI;
  uint256 token_id;
  mapping(address => Token[]) user_tokens;
  Counters.Counter private _tokenIds;

  constructor(string memory _initBaseURI) ERC721('VolcanoCoin', 'VLC') {
      setBaseURI(_initBaseURI);
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  function mint(string memory _tokenURI) public returns (uint256) {
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();
    _safeMint(_msgSender(), newItemId);

    Token memory token  = Token(newItemId, block.timestamp, _tokenURI);
    user_tokens[_msgSender()].push(token);
  
   return newItemId;
  }

  function accountTokens(address _owner) public view returns (Token[] memory) {
    return user_tokens[_owner];
  }

  function _transfer(address to, uint256 tokenId) public {
    safeTransferFrom(_msgSender(), to, tokenId);
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }
}
