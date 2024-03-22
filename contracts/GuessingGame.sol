// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error IncorrectDepositToPlay();

contract GuessingGame is Ownable, ReentrancyGuard {
    bytes32 public hashedSecretNumber;
    IERC20 public guessingToken;
    uint256 public contractETHBalance;

    uint256 public constant FEE_TO_PLAY = 0.001 ether;

    event SecretNumberChanged(bytes32 indexed newHashedSecretNumber);
    event UserWon(address indexed _winner);
    event UserLost(address indexed _loser);

    constructor(bytes32 _hashedSecretNumber, address _guessingToken) Ownable() {
        hashedSecretNumber = _hashedSecretNumber;
        guessingToken = IERC20(_guessingToken);
    }

    function changeHashedSecretNumber(
        bytes32 _newHashedSecretNumber
    ) external onlyOwner {
        hashedSecretNumber = _newHashedSecretNumber;
        emit SecretNumberChanged(_newHashedSecretNumber);
    }

    function guessNumber(uint256 _num) external payable nonReentrant {
        // Better to not accept any other values, to avoid complexity to maintain the true ETH balance of the contract.
        if (msg.value != FEE_TO_PLAY) revert IncorrectDepositToPlay();

        // The payout includes current input msg.value
        contractETHBalance += msg.value;

        bytes32 hashedInputNumber = keccak256(abi.encode(_num));

        if (hashedInputNumber == hashedSecretNumber) {
            guessingToken.transfer(msg.sender, 100 ether); // Transferring 100 GUESS tokens
            uint256 valueToTransfer = (contractETHBalance * 80) / 100;

            // There is a re-entrancy guard just in case the msg.sender is a contract and tries to call the guess function again.
            payable(msg.sender).call{value: valueToTransfer}("");
            emit UserWon(msg.sender);
            return;
        }

        // Could have added the number guessed as information in the event but better to let the indexers/devs do some extra to find out the already guessed numbers.
        emit UserLost(msg.sender);
        return;
    }
}
