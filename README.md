# NFTs as Wallets

This decentralized application (dApp) was built using the `create-solana-dapp` framework with the React, Vite, and TypeScript legacy template. This repository demonstrates how Metaplex Core NFTs can be transformed into fully functional wallets capable of receiving and sending SOL and SPL fungible tokens. By leveraging the asset signer and execute functions provided by the Metaplex Umi SDK, each NFT becomes a wallet, allowing users to connect their Solana wallet, view their Core NFTs in a list, click to see detailed NFT information, and perform asset management operations directly through the NFT.

## Features

- **Wallet Connection**: Connect your Solana wallet (e.g., Phantom) to access and manage your Core NFTs.
- **NFT List View**: Browse your collection of Metaplex Core NFTs, each acting as a wallet, displayed in an intuitive list with clickable details.
- **NFT Wallet Operations**:
  - **Airdrop SOL**: Request a SOL airdrop to the NFT (acting as a wallet) on devnet.
  - **Send SOL**: Transfer SOL from the NFT wallet to another address.
  - **Send SPL Tokens**: Move SPL fungible tokens from the NFT wallet to other accounts.
  - **Transfer NFT Ownership**: Change the ownership of the NFT wallet to another Solana address.

## Metaplex Umi SDK

This project heavily utilizes the **Metaplex Umi SDK**, a powerful and modular JavaScript/TypeScript library designed to simplify interactions with the Solana blockchain and Metaplex protocols. Umi provides a streamlined interface for managing Metaplex Core NFTs, handling tasks such as minting, fetching metadata, and executing transactions. Its modular design allows us to integrate specific plugins for tasks like asset signing and transaction execution, making it ideal for transforming NFTs into functional wallets. The SDK's flexibility and robust tooling enable seamless integration with the Solana ecosystem, ensuring efficient and secure operations for NFT wallet functionalities.

## Metaplex Core NFTs

**Metaplex Core NFTs** are a new standard introduced by Metaplex for creating and managing non-fungible tokens on the Solana blockchain. Unlike traditional NFTs, Core NFTs are designed to be lightweight, flexible, and highly programmable, making them ideal for advanced use cases like acting as wallets. They leverage Solana's high-performance blockchain to enable fast and cost-efficient minting, storage, and transaction execution. Core NFTs store metadata on-chain or via external URIs (e.g., `sample_metadata.json`), allowing for rich customization, such as embedding attributes, images, or programmable behaviors. In this dApp, Core NFTs are used not only as unique digital assets but also as fully functional wallets, capable of holding and managing SOL and SPL tokens through their integrated asset signer and execute capabilities.

## Execute Function in Core NFTs

The **execute function** in Metaplex Core NFTs is a key feature that enables NFTs to act as programmable wallets. This function allows the NFT to sign and execute transactions on the Solana blockchain, effectively turning it into a wallet-like entity capable of holding and transferring assets such as SOL and SPL tokens. The execute function leverages the NFT's asset signer, which is a derived program-derived address (PDA) that grants the NFT the authority to sign transactions. By invoking the execute function, users can perform operations like transferring SOL, moving SPL tokens, or updating ownership directly through the NFT, all while maintaining the security and immutability of the Solana blockchain.

## Getting Started

### Prerequisites

To run and interact with this application, ensure you have:

- **Node.js and npm**: Installed to manage dependencies and run the development server.
- **Solana Wallet**: A Solana-compatible wallet (e.g., Phantom) with sufficient devnet SOL to cover rent exemptions and transaction fees.
- **Sample Files**: The repository includes `sample_metadata.json` and `sample_nft_image.png` for minting test NFTs.

### Installation and Setup

1. **Clone the Repository**:

```bash
git clone <repo-url>
cd <repo-name>
```

2. **Install Dependencies**:

```bash
npm install
```

3. **Run in Development Mode**:

```bash
npm run dev
```

Open your browser and navigate to the provided local server URL (typically `http://localhost:5173`).

### Minting Core NFTs

To create NFTs that function as wallets:

- Use the provided `sample_metadata.json` and `sample_nft_image.png` in the repository for testing.
- Visit [Metaplex Core Create](https://core.metaplex.com/create?env=devnet) to mint Metaplex Core NFTs on the Solana devnet via a graphical user interface. In the interface, enter a name for the NFT, specify the wallet owner (your Solana wallet address), and provide a metadata URI. You can use the `sample_metadata.json` file as the metadata URI for quick setup. The minted NFTs will then be viewable and manageable as wallets within the app.

## Disclaimer

The Solana wallet used to interact with this dApp must hold sufficient SOL to cover transaction fees for operations such as airdrops, transfers, and ownership changes on the Solana devnet. This is because the asset signer, implemented as a Program-Derived Address (PDA) via the Metaplex Umi SDK, cannot act as a fee payer. While the PDA enables the NFT to function as a wallet for managing SOL and SPL fungible tokens, the user's connected Solana wallet is responsible for paying the associated transaction fees.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
