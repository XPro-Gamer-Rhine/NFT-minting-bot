const fs = require("fs");
const { ethers, providers } = require("ethers");

require("dotenv").config();
URLS = ["https://ipfs.io/ipfs/QmRyxUM98KcFhuQAreEw6K8rsyg8RtLX167JeraCXGP9Fn"];

//--------------------------------------- Provider and Signer Starts Here --------------------------------------------


BNB_Testnet = 'https://data-seed-prebsc-1-s1.binance.org:8545'
    //BNB_Mainnet ='https://bsc-dataseed1.binance.org:443'
var provider = new ethers.providers.JsonRpcProvider(BNB_Testnet)
let privateKey =
    "f19a53659a5d5ffe80bfbc657d6e0ca0f44697d769ebd517e70435aaba47e0c8";
let wallet = new ethers.Wallet(privateKey, provider);
let CONTRACT_ABI = require("./Tools/ABI.json");
let contractAddress = "0xCE7d5981c184c2C5542C8b31842Ef57955f7B217";
let contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wallet);


async function mintNFT() {
    let transaction = await contract.symbol(); // Minting NFT through contract
    console.log(transaction);
}

mintNFT();