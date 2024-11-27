# erc721-ux

## Intro

Your job is to build a simple UX to visualize and manipulate ERC721 Tokens.

This repo contains the references (code + ABI) for two ERC721 tokens deployed on the Holesky testnet, which you'll need to use.

- [Fake BAYC](contracts/FakeBAYC.sol) (0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE on Holesky ) (get the [ABI](artifacts/contracts/FakeBAYC.sol/FakeBAYC.json))
- [Fake Nefturians](contracts/FakeNefturians.sol) (0x92Da472BE336A517778B86D7982e5fde0C7993c1 on Holesky ) (get the [ABI](artifacts/contracts/FakeNefturians.sol/FakeNefturians.json))
- [Fake Meebits](contracts/FakeMeebits.sol) (0x238cb11301e9fEA82A7aD6C37137690185138eAE on Holesky ) (get the [ABI](artifacts/contracts/FakeMeebits.sol/FakeMeebits.json))
- [Fake Meebits Claimer](contracts/FakeMeebitsClaimer.sol) (0x9B6F990793347005bb8a252A67F0FA4d56521447 on Holesky ) (get the [ABI](artifacts/contracts/FakeMeebitsClaimer.sol/FakeMeebitsClaimer.json))

To get started using these tokens, I suggest you use the hardhat generated ABI and MyCrypto or to visit Etherscan in order to claim/buy a token for each.

## Tasks list

### Creating a js app and connecting to Ethereum

- Create a repo to host your work
- Create a React / Vue JS app and create a page /chain-info(2 pts)
- Connect your app to the Holesky network through Metamask and display the ChainId, the last block number, and user address on /chain-info (2 pts)
- Show an error page and redirect user to it if the chain is not Holesky (1 pt)

### Calling read and write functions

- Create a page /fakeBayc
- Display the name and the total token number (2 pts)
- Create a button to claim a new token for the current user(2 pts)
- Create a page /fakeBayc/{tokenId}
- Display the informations (image and all the attributes) referenced in the Metadata URI for token {tokenId} (2 pts)
- Show a clean error message on /fakeBayc/{tokenId} if the token does not exist (1pt)

### Paying through functions

- Create a page /fakeNefturians
- Display the minimum token price, and create a button to buy a token (this one needs to be paid for) (2 pts)
- Create a page /fakeNefturians/{userAddress}
- Display all the tokens {userAddress} id's has with nft name and description from metadata and token

### Calling a minter with a signature

- Create a page /fakeMeebits
- Create a button to mint a token.
- Read the contract
- Let the user pick a token number that wasn't minted yet
- use [signature data](claimerV1-tools) to call function `claimAToken()` on [fake meebits claimer](contracts/FakeMeebits.sol) correctly (4 pts)

### Bonus

- Deploy your static web site (2 pts)
