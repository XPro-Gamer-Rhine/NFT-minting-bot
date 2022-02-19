const { ethers } = require("ethers");

var provider = new ethers.providers.WebSocketProvider("wss://rinkeby.infura.io/ws/v3/050c5f4ce54a436cac80a00effeb7844", "rinkeby");
let privateKey = "c2192af9b9ab2338aa6e240f7bddf162fc6c5c4f54cdf080c551316880d8c88a";
let wallet = new ethers.Wallet(privateKey,provider);
let CONTRACT_ABI = require('./Tools/ABI.json');
let rinkebyAddress = "0x61635c703a26dC76Aa098562835144a509806172";
let contract = new ethers.Contract(rinkebyAddress, CONTRACT_ABI, wallet);


async function getComputedStyle(){
    let  transaction = await contract.createCollectible('https://ipfs.io/ipfs/QmecwKB2ctoGiuf6RX3JMjbJ9D6Ss59EMBCjW6tkieefcB');
    await transaction.wait()
    console.log(transaction)
}

getComputedStyle()
