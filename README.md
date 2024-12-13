# Ethereum DApp: Fake NFT Marketplace

deployed on Vercel : https://erc-721-hgmdnot8e-emirza12s-projects.vercel.app/

## Overview

This project is a TypeScript-based decentralized application (DApp) built using **React** and **Vite**. It connects to the **Holesky** network through **MetaMask** and allows users to interact with multiple smart contracts for NFT-related operations. The app supports multiple pages to manage, claim, and display NFTs, as well as minting and purchasing functionalities.

## Features Implemented

1. **/chain-info**  
   Displays the current Ethereum **ChainId**, the **last block number**, and the **user address** connected via MetaMask. If the user is not connected to the Holesky network, an error page is displayed, and the user is redirected.
   
2. **/fakeBayc**  
   Displays the name and total token number of the **Fake Bored Ape Yacht Club** collection. The user can claim a new token by clicking a button that triggers a write function on the smart contract.

3. **/fakeBayc/{tokenId}**  
   Displays the information (image and attributes) of a specific token by calling its **metadata URI** based on the provided `tokenId`. If the token does not exist, an error message is displayed.

4. **/fakeNefturians**  
   Displays the **minimum token price** and allows the user to **purchase** an NFT token. The purchase requires a transaction and payment via MetaMask.

5. **/fakeNefturians/{userAddress}**  
   Displays all the tokens owned by the given `userAddress`, showing the token IDs, names, and descriptions (from metadata).

6. **/fakeMeebits**  
   Allows the user to **mint a new token**. The user can select a token that has not yet been minted and claim it using a signed message, invoking the `claimAToken()` function from the contract.

## Technologies Used

- **React** - Frontend library
- **Vite** - Build tool for fast development
- **Ethers.js** - Ethereum library for interacting with smart contracts
- **MetaMask** - Browser extension wallet for Ethereum
- **Solidity** - Smart contracts deployed on the **Holesky network**
- **IPFS** - For storing metadata for NFTs (e.g., image, name, description)

## Prerequisites

1. **MetaMask**: Install the MetaMask browser extension if you haven't already.
   - Download it here: [MetaMask](https://metamask.io/)
   
2. **Holesky Network**: Connect your MetaMask to the **Holesky** network.
   - In MetaMask, navigate to `Networks` > `Holesky` (or add it if it's not listed).

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fake-nft-marketplace.git
cd fake-nft-marketplace
```

### 2. Install Dependencies

Install the necessary dependencies for React and Ethers.js:

```bash
npm install
```
### 3. Configure Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

```bash
VITE_HOLESKY_API=<your_etherscan_api_key>
VITE_PRIVATE_KEY=<your_holesky_private_key>
```
### 4. Start the Development Server

Once you’ve installed the dependencies and set up the environment variables, you can run the development server:

```bash
npm run dev