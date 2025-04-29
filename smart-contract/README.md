# TradeFlow B2B Smart Contracts

This directory contains the smart contracts for the **TradeFlow B2B** platform, built using **Foundry**, a fast and modular toolkit for Ethereum application development.

## Overview

The smart contracts in this project are designed to facilitate seamless B2B payments on the **Celo blockchain**. They enable merchants, wholesalers, and retailers to transact using stablecoins while storing metadata for transparency and auditability.

### Key Features

- **Stablecoin Payments**: Supports Mento stablecoins like cUSD, cEUR, and others.
- **On-Chain Metadata**: Stores transaction metadata (e.g., payment reasons) for easy retrieval.
- **Mento Broker Integration**: Enables seamless currency swaps using Mento's broker contract.
- **MiniPay Optimization**: Designed to work with MiniPay for a mobile-first experience.

## Foundry Toolkit

This project uses Foundry for development, testing, and deployment of the smart contracts. Foundry consists of:

- **Forge**: Ethereum testing framework.
- **Cast**: Swiss army knife for interacting with EVM smart contracts.
- **Anvil**: Local Ethereum node for testing.
- **Chisel**: Solidity REPL for quick prototyping.

## Documentation

For detailed Foundry documentation, visit: [Foundry Book](https://book.getfoundry.sh/)

## Usage

### Build the Contracts

```shell
forge build
```

### Run Tests

```shell
forge test
```

### Format the Code

```shell
forge fmt
```

### Generate Gas Snapshots

```shell
forge snapshot
```

### Start a Local Node

```shell
anvil
```

### Deploy the Contracts

```shell
forge script script/TradeflowB2BScript.s.sol:TradeflowB2BScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Interact with Contracts

Use `cast` to interact with deployed contracts:

```shell
cast <subcommand>
```

### Help Commands

```shell
forge --help
anvil --help
cast --help
```

## Smart Contract Structure

- **`src/TradeflowB2B.sol`**: The main contract implementing the B2B payment logic.
- **`script/TradeflowB2BScript.s.sol`**: Deployment and configuration scripts.
- **`test/`**: Contains unit tests for the smart contracts.

## Deployment

### Alfajores Testnet

- Contract Address: `0x92c7d8B28b2c487c7f455733470B27ABE2FefF13`

### Celo Mainnet

- Contract Address: `0x9b55647cb55B5a4367D356069d29e969584Ceb18`

## Contributing

We welcome contributions to improve the smart contracts! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
