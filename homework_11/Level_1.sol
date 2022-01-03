pragma solidity 0.6.0;

contract Level_1_Brute_Force {

    bool public levelComplete;
    bytes32 public answer;

    event Guess(bytes32 _guess);

    constructor() public {
        levelComplete = false;
        answer = 0x04994f67dc55b09e814ab7ffc8df3686b4afb2bb53e60eae97ef043fe03fb829;
    }

    function completeLevel(uint8 n) public {
        bytes32 _guess = keccak256(abi.encodePacked(n));
        emit Guess(_guess);
        require(_guess == answer);
        levelComplete = true;
    }
}