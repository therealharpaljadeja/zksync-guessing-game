# zkSync Guessing Game

Guess the secret number and win 80% of contract balance + 100 $GUESS tokens.

This project was scaffolded with [zksync-cli](https://github.com/matter-labs/zksync-cli).

## Project Layout

-   `/contracts`: Contains solidity smart contracts.
-   `/frontend`: Frontend code
-   `/deploy`: Scripts for contract deployment and interaction.
-   `hardhat.config.ts`: Configuration settings.

### Environment Settings

To keep private keys safe, this project pulls in environment variables from `.env` files. Primarily, it fetches the wallet's private key.

Rename `.env.example` to `.env` and fill in your private key:

```
WALLET_PRIVATE_KEY=your_private_key_here...
```

## Requirements

-   `yarn`
-   Browser Injected Wallet (if you don't have a browser injected wallet, the frontend will suggest to install one)

## How to Use

### Deploying Contracts

-   `yarn`: Install dependencies
-   `yarn run compile`: Compiles contracts.
-   `yarn run deploy:guessingToken`: Deploy GuessingToken using script `/deploy/erc20/deploy.ts`.
-   `yarn run deploy:guessingToken`: Deploy GuessingToken using script `/deploy/guessing_game_deploy.ts`.

### Launching the frontend

`cd frontend` - Change directory to `/frontend`

-   `yarn`: Install dependencies.
-   `yarn run dev`: Starts the frontend on localhost.

### How does it work?

#### [GuessingToken.sol](https://sepolia.explorer.zksync.io/address/0x780E804A775A41a5F4eaC366b66Cb572547571e4#contract)

-   Mints 1M $GUESS to the deployer

#### [GuessingGame.sol](https://sepolia.explorer.zksync.io/address/0x854C7dDF36EBE3dbC4ad141B4A14ae00867A995d#contract)

-   `constructor`

    -   Takes in a `_hashedSecretNumber` and `_guessingToken` address.
    -   Anything stored on the blockchain is public, so avoid secret number being leaked I hash it locally before deploying the contract (The secret number is also not available in the codebase).

-   `changeHashedSecretNumber`

    -   Let's only the owner of the contract to change the `hashedSecretNumber` value.

-   `guessNumber`

    -   Takes in `0.001 ETH` and a number.
    -   Hashes the number and compares it with the `hashedSecretNumber`.
    -   If the guess is correct then users gets 80% of the contract's ETH balance and 100 $GUESS tokens.
    -   If the guess is incorrect then the contract keeps the `0.001 ETH` deposit
    -   Emit `UserLost` on wrong guess.
    -   Emit `UserWon` on the right guess.

### Transactions

-   [Token Deployment](https://sepolia.explorer.zksync.io/tx/0xe68ff876a7a49f9996270a2a9df5f89525c0a4601a9a5bb15fa0097ce6aca7c9)
-   [Game Deployment](https://sepolia.explorer.zksync.io/tx/0x3d657bec0bd8a689d416169157437dae65c6df360783c8d597454dece614a182)
-   [Game Win](https://sepolia.explorer.zksync.io/tx/0x4d12600bcb9f6c67fa27f72f8d7b318bb8a92cf82ede60719b9748546868cea3)
-   [Game Loss](https://sepolia.explorer.zksync.io/tx/0xedbfff4fe32918e735b4955eb07a202bae0f5b2a38de502b3e795c8a806a3797)

## License

This project is under the [MIT](./LICENSE) license.
