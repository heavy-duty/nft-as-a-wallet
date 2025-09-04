# NFTs as Wallets

This decentralized application (dApp) was built using the `create-solana-dapp` framework with the React, Vite, and TypeScript legacy template. This repository demonstrates how Metaplex Core NFTs can be transformed into fully functional wallets capable of receiving and sending SOL and SPL fungible tokens. By leveraging the asset signer and execute functions, each NFT becomes a wallet, allowing users to connect their Solana wallet, view their Core NFTs in a list, click to see detailed NFT information, and perform asset management operations directly through the NFT.

## Features

- **Wallet Connection**: Connect your Solana wallet (e.g., Phantom) to access and manage your Core NFTs.
- **NFT List View**: Browse your collection of Metaplex Core NFTs, each acting as a wallet, displayed in an intuitive list with clickable details.
- **NFT Wallet Operations**:
  - **Airdrop SOL**: Request a SOL airdrop to the NFT (acting as a wallet) on devnet.
  - **Send SOL**: Transfer SOL from the NFT wallet to another address.
  - **Send SPL Tokens**: Move SPL fungible tokens from the NFT wallet to other accounts.
  - **Transfer NFT Ownership**: Change the ownership of the NFT wallet to another Solana address.

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

The Solana wallet used to operate the NFT wallet must hold sufficient SOL to cover rent exemptions and transaction fees for operations like airdrops, transfers, and ownership changes on the devnet.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
