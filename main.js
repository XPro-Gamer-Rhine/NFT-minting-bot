const { create } = require('ipfs-http-client');
const fs = require('fs');
const { ethers } = require('ethers');
var All_IPFS_JSON_LINKS = [];
const categories = [
  'Dogs',
  'Cats',
  'Birds',
  'Reptiles',
  'Amphibians',
];

const gender = ['male', 'female', 'other'];

var attributes = [
  {
    tire: Math.floor(Math.random() * 101),
  },
  {
    breedCount: Math.floor(Math.random() * 101),
  },
  {
    agility: Math.floor(Math.random() * 101),
  },
  {
    weight: Math.floor(Math.random() * 101),
  },
  {
    stamina: Math.floor(Math.random() * 101),
  },
  {
    health: Math.floor(Math.random() * 101),
  },
  {
    luck: Math.floor(Math.random() * 101),
  },
];
//--------------------------------------- Provider and Signer Starts Here --------------------------------------------
const dogNftAddress = '0x7e421a72Fb7AbE35E0DB4B7482A7F6f71dbba013';
const marketAddress = '0x409c73F79BbD4802EFa2cC669d6E158b480B5764';
const marketAbi = require('./marketABI.json');
const dogNftAbi = require('./dogABI.json');

var INFURA_ID = '22348f916b8944be930ac83951a7a245';
var provider = new ethers.providers.JsonRpcProvider(
  `https://polygon-mumbai.infura.io/v3/${INFURA_ID}`
);
let privateKey =
  '70080423dcb2a9c24e2701b73bd1d65b8b08642d7e7d8c428385c75922d4e6b2';
let wallet = new ethers.Wallet(privateKey, provider);
let marketContract = new ethers.Contract(
  marketAddress,
  marketAbi,
  wallet
);
let dogContract = new ethers.Contract(
  dogNftAddress,
  dogNftAbi,
  wallet
);
//--------------------------------------- Provider and Signer Ends Here --------------------------------------------

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const ipfsClient = async () => {
  const ipfs = await create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  });
  return ipfs;
};

const main = (_fn) => {
  setTimeout(function () {
    var FILES = fs.readdirSync('./build/images/');
    FILES.map(async (_image) => {
      var _id = String(_image).replace('.png', '');
      try {
        let ipfs = await ipfsClient();
        let img = fs.readFileSync('./build/images/' + _image);
        let options = {
          warpWithDirectory: false,
          // progress: (prog) => console.log(`Saved :${prog}`),
        };
        let result = await ipfs.add(img, options);
        var CID = String(result['cid']);
        var url = 'https://ipfs.io/ipfs/' + CID;
        await sleep();
        const category = Math.floor(
          Math.random() * categories.length
        );
        var fileName = `./build/json/${_id}.json`;
        var json_file = require(fileName);
        json_file.image = url;
        json_file.category = categories[category];
        fs.writeFile(
          fileName,
          JSON.stringify(json_file),
          function writeJSON(err) {
            if (err) return console.log(err);
          }
        );
        console.log(`${_id} has been updated`);
      } catch (e) {
        console.log('Image Failed To Be Uploaded To IPFS');
      }
    });

    _fn();
  }, 1000);
};

const readyJsonFiles = (_fn) => {
  setTimeout(function () {
    var JSON_FILES = fs.readdirSync('./build/json/');
    JSON_FILES.map(async (item) => {
      _jsonFilePath = './build/json/' + item;
      try {
        let ipfs = await ipfsClient();
        let data = fs.readFileSync(_jsonFilePath);
        let result = await ipfs.add(data);

        var CID = String(result['cid']);
        var url = 'https://ipfs.io/ipfs/' + CID;
        await sleep();
        const _gender = Math.floor(Math.random() * gender.length);
        await dogContract.createCollectible(url, attributes, _gender);
        let tokenCounter = await dogContract.tokenCounter();
        let tokenID = 0;
        if (tokenCounter > 1) {
          tokenID = tokenCounter.toNumber() - 1;
        } else {
          tokenID = 0;
        }
        await dogContract.approve(marketAddress, tokenID);
        const value = ethers.utils.parseEther('0.0001');
        const gasLimit = 4500000;
        await marketContract.addMarketItem(tokenID, dogNftAddress, {
          value: value,
          gasLimit: gasLimit,
        });

        All_IPFS_JSON_LINKS.push(url);
      } catch (e) {
        console.log(e);
      }
    });

    _fn();
  }, 4000);
};

// const task3 = (_fn) => {
//   setTimeout(function () {
//     var file = fs.createWriteStream('array.txt');
//     All_IPFS_JSON_LINKS.forEach(function (v) {
//       file.write(v.join(', ') + '\n');
//     });
//     file.end();
//     _fn();
//   }, 1000);
// };

function init(tasks, _fn) {
  if (!tasks.length) {
    return _fn();
  }

  let index = 0;

  function run() {
    var task = tasks[index++];
    console.log('running task:', task.name, index);
    task(index === tasks.length ? _fn : run);
  }

  run();
}

init([readyJsonFiles], function () {
  console.log('tasks done!');
});
