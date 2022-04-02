const { create } = require("ipfs-http-client");
const fs = require("fs");
const { ethers } = require("ethers");
var All_IPFS_JSON_LINKS = [];


require('dotenv').config();
//--------------------------------------- Provider and Signer Starts Here --------------------------------------------
var provider = new ethers.providers.WebSocketProvider(
  String(process.env.ENV_INFURA_ADDRESS),
  String(process.env.ENV_INFURA_NETWORK)
);
let privateKey = String(process.env.ENV_METAMASK_PRIVATE_KEY);
let wallet = new ethers.Wallet(privateKey, provider);
let CONTRACT_ABI = require("./Tools/ABI.json");
let contractAddress = String(process.env.ENV_DEPLOYED_CONTRACT_ADDRESS);
let contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wallet);
//--------------------------------------- Provider and Signer Ends Here --------------------------------------------

// Here we are editing the json to replace the default image url with the IPFS url
async function editMetaData(_image, _id) {
  var fileName = `./build/json/${_id}.json`; //reading every json by id from build/json folder
  var json_file = require(fileName); //requiring the files
  json_file.image = _image;
  fs.writeFile(fileName, JSON.stringify(json_file), function writeJSON(err) {//re-writing the json files image row
    if (err) return console.log(err);
  });
}

// Here we are initilizing the IPFS client
async function ipfsClient() {
  const ipfs = await create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });
  return ipfs;
}

// Here we are reading the images from build/images folder and uploading them to IPFS and retriving the CID
async function saveFile(_image, _id) {
  try {
    let ipfs = await ipfsClient();
    let img = fs.readFileSync("./build/images/" + _image);//reading all the images form the build/images folder
    let options = {
      warpWithDirectory: false,
      progress: (prog) => console.log(`Saved :${prog}`),
    };
    let result = await ipfs.add(img, options); //uplaoding images from build/images to IPFS
    var CID = String(result["cid"]);
    var url = "https://ipfs.io/ipfs/" + CID;//retrive IPFS image url
    editMetaData(url, _id);//pass url to editMetaData
  } catch (e) {
    console.log("Image Failed To Be Uploaded To IPFS");
  }
}

// Here we are uploading the IPFS url to mint the NFTs
async function uploadNFT(URLS) {
  console.log("---------------- Printing All The IPFS URLS -------------------")
  console.log(URLS)
  console.log("---------------- Minting The NFTs -------------------")
  let transaction = await contract.createCollectibleFromList(URLS, 5); // Minting NFT through contract
  await transaction.wait();
  console.log("---------------- Minting The NFTs Finished -------------------")

  return false;
}

// Here we are creating IPFS address for bulk url upload in uploadNFT function
async function uploadJsonFile(_jsonFilePath) {
    try {
        let ipfs = await ipfsClient(); // calling IPFS client
        let data = fs.readFileSync(_jsonFilePath) // reading all the json files from build/json
        let result = await ipfs.add(data);

        var CID = String(result['cid']);
        var url = "https://ipfs.io/ipfs/" + CID; // creating perfect IPFS url
        All_IPFS_JSON_LINKS.push(url) //pushing url to ALL_IPFS_JSON_LINKS
        var fileName = `./build/data.json`;
        console.log(url)
        fs.writeFile(fileName, JSON.stringify(All_IPFS_JSON_LINKS), function writeJSON(err) { //save ALL_IPFS_JSON_LINKS to data.json
            if (err) return console.log(err);
        });
    } catch (e) {
        console.log(e)
    }
}

// Here we are reading every json from the json folder and passing them in uploadJsonFile function
async function readyJsonFiles() {
  var JSON_FILES = fs.readdirSync("./build/json/"); //read all the json files
  JSON_FILES.map((item) => {
    jsonFilePath = "./build/json/" + item; //selecting each json file by id
    uploadJsonFile(jsonFilePath);
  });
}

// Here we are reading from the data.json file and passing all the links to uploadNFT function
function readJsonAsArray(){
    var fileName = `./build/data.json`; //reading data.json
    var json_file = require(fileName);
    uploadNFT(json_file)
}


function main() {
  var FILES = fs.readdirSync("./build/images/"); // reading all the images from build/images
  FILES.map((item) => {
    var id = String(item).replace(".png", ""); //replacing .png to get the id
    saveFile(item, id); //passing image and id to saveFile functions
  });
  
}



setTimeout(() => {
  main();
}, 5000);

setTimeout(() => {
  readyJsonFiles();
}, 6000);

setTimeout(() => {
  readJsonAsArray();
}, 7000);