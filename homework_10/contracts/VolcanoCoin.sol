// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract VolcanoCoin is ERC20("Volcano Coin", "VLC"), AccessControl {
    using Counters for Counters.Counter;

    Counters.Counter private ids;
    uint256 constant initialSupply = 100000;

    enum PaymentType {
        Unknown,
        Basic,
        Refund,
        Dividend,
        Group
    }

    struct Payment{
        uint256 id;
        uint256 amount;
        address recipient;
        PaymentType type_payment;
        string comment;
        uint256 timestamp;
    }

    mapping (address => Payment[]) public payments;
    event supplyChanged(uint256);

    constructor() {
        _mint(msg.sender, initialSupply);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function transfer(address _recipient, uint256 _amount) public virtual override returns (bool) {
        _transfer(msg.sender, _recipient, _amount);
        addPaymentRecord(_recipient, _amount);
        return true;
    }

    function addPaymentRecord(address _recipient, uint256 _amount) internal {
        payments[msg.sender].push(Payment(ids.current(), _amount, _recipient, PaymentType.Basic, "", block.timestamp));
        ids.increment();
    }

    function addToTotalSupply(uint256 _quantity) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _mint(msg.sender,_quantity);
        emit supplyChanged(_quantity);
    }

    function getPayments(address _user) public view returns (Payment[] memory) {
        return payments[_user];
    }

    function updatePayment(uint256 id, PaymentType _type, string memory comment) public  {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || id == payments[msg.sender][id].id, "must-be-onwer-or-admin");
        Payment memory payment = payments[msg.sender][id];
        payment.type_payment = _type;
        if(hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            string memory updatedBy = "update by ";
            payment.comment = append(comment, updatedBy, toAsciiString(msg.sender));
        } else {
            payment.comment = comment;
        }
        payment.comment = comment;
        payments[msg.sender][id] = payment;
    }

    function append(string memory a, string memory b, string memory c) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c));
    }

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

}