// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MyERC20Token
 * @dev This is a basic ERC20 token using the OpenZeppelin's ERC20PresetFixedSupply preset.
 * You can edit the default values as needed.
 */
contract GuessingToken is ERC20 {
    /**
     * @dev Constructor to initialize the token with default values.
     * You can edit these values as needed.
     */
    constructor() ERC20("GuessingToken", "GUESS") {
        // Default initial supply of 1 million tokens (with 18 decimals)
        uint256 initialSupply = 1_000_000 * (10 ** 18);

        // The initial supply is minted to the deployer's address
        _mint(msg.sender, initialSupply);
    }
}
