
const { create } = require("ipfs-http-client");
const fs = require("fs");
const { ethers } = require("ethers");
var All_IPFS_JSON_LINKS = [];

console.log('Server-side code running');
const express = require('express');

const app = express();

// serve files from the public directory
app.use(express.static('public'));

// start the express web server listening on 8080
app.listen(8080, () => {
    console.log('listening on 8080');
});

// serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/fuck', (req, res) => {
    main()
});

app.get('/fuck2', (req, res) => {
    readyJsonFiles()
});

app.get('/fuck3', (req, res) => {
    boobs()
});


//--------------------------------------- Provider and Signer Starts Here --------------------------------------------
var provider = new ethers.providers.WebSocketProvider("wss://rinkeby.infura.io/ws/v3/050c5f4ce54a436cac80a00effeb7844", "rinkeby");
let privateKey = "c2192af9b9ab2338aa6e240f7bddf162fc6c5c4f54cdf080c551316880d8c88a";
let wallet = new ethers.Wallet(privateKey, provider);
let CONTRACT_ABI = require('./Tools/ABI.json');
let address = "0xDf167E606065EE294Ac098da8b1f8f1fd5fF9232";
let contract = new ethers.Contract(address, CONTRACT_ABI, wallet);
//--------------------------------------- Provider and Signer Ends Here --------------------------------------------

async function editMetadata(_image, _id) {
    var fileName = `./build/json/${_id}.json`;
    var json_file = require(fileName);
    json_file.image = _image;
    fs.writeFile(fileName, JSON.stringify(json_file), function writeJSON(err) {
        if (err) return console.log(err);
    });
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

async function MintNFT(_link) {
    try {
        let transaction = await contract.createCollectible(_link);
        await transaction.wait()
        console.log("------ UPLOADED -------")
        console.log(transaction)
    } catch (e) {
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
        All_IPFS_JSON_LINKS.push(url)
        var fileName = `./build/data.json`;
        fs.writeFile(fileName, JSON.stringify(All_IPFS_JSON_LINKS), function writeJSON(err) {
            if (err) return console.log(err);
        });
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

function boobs(){
    var fileName = `./build/data.json`;
    var json_file = require(fileName);
    for(var i=0;i<json_file.length;i++) {
        MintNFT(json_file[i]);
    }
}