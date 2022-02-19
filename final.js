const { create } = require("ipfs-http-client");
const fs = require("fs");
const { ethers } = require("ethers");
var All_IPFS_JSON_LINKS = [];

//--------------------------------------- Provider and Signer Starts Here --------------------------------------------
var provider = new ethers.providers.WebSocketProvider("wss://rinkeby.infura.io/ws/v3/050c5f4ce54a436cac80a00effeb7844", "rinkeby");
let privateKey = "3b02eaa0f2c6c33152e318effe265447709976b4a1ca77ff95ca650d99ae9385";
let wallet = new ethers.Wallet(privateKey,provider);
let CONTRACT_ABI = require('./Tools/ABI.json');
let address = "0xbE3812a30Cbe3dFF9E25f171175fbb41d368B45f";
let contract = new ethers.Contract(address, CONTRACT_ABI, wallet);
//--------------------------------------- Provider and Signer Ends Here --------------------------------------------

async function editMetadata(_image, _id) {
    var fileName = `./build/json/${_id}.json`;
    var json_file = require(fileName);
    json_file.image = _image;
    fs.writeFile(fileName, JSON.stringify(json_file), function writeJSON(err) {
        if (err) return console.log(err);
    });
    // try {
    //     json_file[_id-1].image= _image;
    //     var fileName2 = `./build/metadata.json`;
    //     fs.writeFile(fileName2, JSON.stringify(json_file), function writeJSON(err) {
    //         if (err) return console.log(err);
    //     });
    // } catch (e) { console.log(e.message); }
};


async function ipfsClient() {
    const ipfs = await create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https"
    });
    return ipfs;
}

async function saveFile(_image, _id) {
    try {
        let ipfs = await ipfsClient();
        let img = fs.readFileSync("./build/images/" + _image)
        let options = {
            warpWithDirectory: false,
            progress: (prog) => console.log(`Saved :${prog}`)
        }
        let result = await ipfs.add(img, options);
        var CID = String(result['cid']);
        var url = "https://ipfs.io/ipfs/" + CID;
        editMetadata(url, _id)
    } catch (e) {
        console.log("Image Failed To Be Uploaded To IPFS");
    }

}

async function MintNFT(_link){
    try{
        let  transaction = await contract.createCollectible(_link);
        await transaction.wait()
        console.log("------ UPLOADED -------")
        console.log(transaction)
    }catch(e){
        console.log("Upload Failed");
    }
}

async function uploadJsonFile(_jsonFilePath) {
    try {
        let ipfs = await ipfsClient();
        let data = fs.readFileSync(_jsonFilePath)
        let result = await ipfs.add(data);
        
        var CID = String(result['cid']);
        var url = "https://ipfs.io/ipfs/" + CID;
        MintNFT(url)
        
    } catch (e) {
        console.log(e)
    }

}

async function readyJsonFiles() {
    var JSON_FILES = fs.readdirSync('./build/json/');
    JSON_FILES.map((item) => {
        jsonFilePath = "./build/json/" + item;
        uploadJsonFile(jsonFilePath);
    })
}

function main() {
    var FILES = fs.readdirSync('./build/images/');
    FILES.map((item) => {
        var id = String(item).replace('.png', '');
        saveFile(item, id);
    })
    
}


// main();
readyJsonFiles();
