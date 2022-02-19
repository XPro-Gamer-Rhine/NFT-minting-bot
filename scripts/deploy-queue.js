
// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  const ArtEco = await hre.ethers.getContractFactory("NFT");
  const arteco = await ArtEco.deploy("NFT Art","❖");

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();
  
  await arteco.deployed();
  await token.deployed();

  console.log("ArtEco deployed to:", arteco.address);
  console.log("Token deployed to:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });