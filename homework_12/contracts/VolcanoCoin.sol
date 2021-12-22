//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VolcanoCoin is ERC721Upgradeable, OwnableUpgradeable {
    using Counters for Counters.Counter;
    uint256 public constant version = 1;

    struct Token {
        uint256 tokenId;
        uint256 timestamp;
        string tokenURI;
    }

    string public baseURI;
    uint256 token_id;
    mapping(address => Token[]) user_tokens;
    Counters.Counter private _tokenIds;

    function initialize(string memory _initBaseURI) public initializer {
        __Ownable_init();
        __ERC721_init("VolcanoCoin", "VLC");
        setBaseURI(_initBaseURI);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function mint(address owner, string memory _tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(owner, newItemId);

        Token memory token = Token(newItemId, block.timestamp, _tokenURI);
        user_tokens[owner].push(token);

        return newItemId;
    }

    function accountTokens(address _owner)
        public
        view
        returns (Token[] memory)
    {
        return user_tokens[_owner];
    }

    function _transfer(address to, uint256 tokenId) public {
        safeTransferFrom(_msgSender(), to, tokenId);
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function _msgData()
        internal
        pure
        override(ContextUpgradeable)
        returns (bytes memory)
    {
        return msg.data;
    }

    function _msgSender()
        internal
        view
        override(ContextUpgradeable)
        returns (address)
    {
        return msg.sender;
    }
}
