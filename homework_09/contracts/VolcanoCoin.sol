// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VolcanoCoin is ERC20("Volcano Coin", "VLC"), Ownable {

    uint256  constant initialSupply = 100000;

    struct Payment{
        uint amount;
        address recipient;
    }

    mapping (address => Payment[]) public payments;
    event supplyChanged(uint256);

    constructor() {
        _mint(msg.sender, initialSupply);
    }

    function transfer(address _recipient, uint _amount) public virtual override returns (bool) {
        _transfer(msg.sender, _recipient, _amount);
        addPaymentRecord(msg.sender, _recipient, _amount);
        return true;
    }

    function addPaymentRecord(address _sender, address _recipient, uint _amount) internal {
        payments[_sender].push(Payment(_amount,_recipient ));
    }

    function addToTotalSupply(uint256 _quantity) public onlyOwner {
        _mint(msg.sender,_quantity);
        emit supplyChanged(_quantity);
    }

    function getPayments(address _user) public view returns (Payment[] memory) {
        return payments[_user];
    }
}