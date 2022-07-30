const { create } = require('ipfs-http-client');
const fs = require('fs');
const { ethers } = require('ethers');
var All_IPFS_JSON_LINKS = [];

// create ipfs client
async function ipfsClient() {
  const ipfs = await create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  });
  return ipfs;
}

// upload the json files to ipfs for NFT
async function uploadJsonFile(_jsonFilePath) {
  try {
    let ipfs = await ipfsClient();
    let data = fs.readFileSync(_jsonFilePath);
    let result = await ipfs.add(data);

    var CID = String(result['cid']);
    var url = 'https://ipfs.io/ipfs/' + CID;
    console.log(url);
    All_IPFS_JSON_LINKS.push(url);
  } catch (e) {
    console.log(e);
  }
}

// read all the edited json files from build/json folder
async function readyJsonFiles() {
  var JSON_FILES = fs.readdirSync('./build/json/');
  JSON_FILES.map((item) => {
    jsonFilePath = './build/json/' + item;
    uploadJsonFile(jsonFilePath);
  });
}

// editing the json files to add new ipfs image links
async function editBaseJson(_image, _id) {
  var fileName = `./build/json/${_id}.json`;
  var json_file = require(fileName);
  json_file.image = _image;
  fs.writeFile(
    fileName,
    JSON.stringify(json_file),
    function writeJSON(err) {
      if (err) return console.log(err);
    }
  );
}

// upload the images to IPFS
async function saveFile(_image, _id) {
  try {
    let ipfs = await ipfsClient();
    let img = fs.readFileSync('./build/images/' + _image);
    let options = {
      warpWithDirectory: false,
      progress: (prog) => console.log(`Saved :${prog}`),
    };
    let result = await ipfs.add(img, options);
    var CID = String(result['cid']);
    var url = 'https://ipfs.io/ipfs/' + CID;
    editBaseJson(url, _id);
  } catch (e) {
    console.log('Image Failed To Be Uploaded To IPFS');
  }
}

// fetch all the images from the build/images folder
function main() {
  var FILES = fs.readdirSync('./build/images/');
  FILES.map((item) => {
    var id = String(item).replace('.png', '');
    saveFile(item, id);
  });
}

// main();
readyJsonFiles().then(() => {
  console.log(All_IPFS_JSON_LINKS);
});
