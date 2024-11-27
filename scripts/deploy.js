// Deploying the TD somewhere
// To verify it on Etherscan:
// npx hardhat verify --network holesky <address> <constructor arg 1> <constructor arg 2>

const hre = require("hardhat");

async function main() {
  // Deploying contracts
  const FakeBAYC = await hre.ethers.getContractFactory("FakeBAYC");
  const fakeBAYC = await FakeBAYC.deploy();
  console.log(
    `FakeBAYC deployed at  ${fakeBAYC.address}`
  );
  
  const FakeNefturians = await hre.ethers.getContractFactory("FakeNefturians");
  const fakeNefturians = await FakeNefturians.deploy();
  console.log(
    `FakeNefturians deployed at  ${fakeNefturians.address}`
  );

  const FakeMeebits = await hre.ethers.getContractFactory("FakeMeebits");
  const fakeMeebits = await FakeMeebits.deploy();
  console.log(
    `FakeMeebits deployed at  ${fakeMeebits.address}`
  );

  const FakeMeebitsClaimer = await hre.ethers.getContractFactory("FakeMeebitsClaimer");
  const fakeMeebitsClaimer = await FakeMeebitsClaimer.deploy(20000,
    fakeMeebits.address);
  console.log(
    `FakeMeebitsClaimer deployed at  ${fakeMeebitsClaimer.address}`
  );

  // Declare FakeMeebitsClaimer as minter for ERC721
  await fakeMeebits.manageMinter(fakeMeebitsClaimer.address, true);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
