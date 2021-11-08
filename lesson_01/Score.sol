// SPDX-License-Identifier: CC-BY-SA-4.0
// Version of Solidity compiler this program was written for
pragma solidity ^0.8.0;

contract Score {
    
    address owner;
    uint score;
    mapping(address => uint) public score_list;

    event NewUserScore(address _user, uint _newScore);
    event NewScore(uint _newScore);

    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        if(msg.sender == owner) {
            _;
        }
    }
    
    function getScore() public view returns (uint) {
        return score;
    }
    
    function setScore(uint _newScore) public onlyOwner {
        score = _newScore;
        emit NewScore(score);
    }

    function setUserScore(address _user, uint _newScore) public onlyOwner {
        score_list[_user] = _newScore;
        emit NewUserScore(_user, _newScore);
    }
}



