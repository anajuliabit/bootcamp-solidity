//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VolcanoCoin is ERC721, Ownable {
    struct Token {
      uint256 tokenId;
      uint256 timestamp;
      string tokenURI;
    }

    uint256 token_id;
    mapping(address => Token[]) user_tokens;
    uint token_counter;

    constructor() ERC721('VolcanoCoin', 'VLC') {
        token_counter = 0;
    }
    
    function mint(string memory _tokenURI) public {
      Token memory token  = Token(token_counter, block.timestamp, _tokenURI);
      user_tokens[_msgSender()].push(token);

      _safeMint(_msgSender(), token_counter);

      token_counter += 1;
    }

    function burn(uint256 _tokenId) public {
      _burn(_tokenId);
      deleteToken(_tokenId);
    }

    function deleteToken(uint256 _tokenId) internal {
      for(uint i = 0; i < user_tokens[_msgSender()].length; i++) {
        if(user_tokens[_msgSender()][i].tokenId == _tokenId) {
          delete user_tokens[_msgSender()][i];
          break;
        }
      }
    }

}
