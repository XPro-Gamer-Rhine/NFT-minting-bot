const { create } = require("ipfs-http-client");
const fs = require("fs");
const reader = require('xlsx')
const basePath = process.cwd();
const buildDir = `${basePath}/`;
var metadataList = [];
var attributesList = [];

const addMetadata =  (_image,_title,_description,_category,_subCategory,_edition)=> {
    let dateTime = Date.now();
    let tempMetadata = {
      name: _title,
      description: _description,
      image: _image,
      edition: _edition,
      date: dateTime,
      attributes: [{
        "Category": _category,
        "Sub Category": _subCategory
      }],
    };
   
    metadataList.push(tempMetadata);
    fs.existsSync("json") || fs.mkdirSync("json");
    let metadata = metadataList.find((meta) => meta.edition == _edition);
    fs.writeFileSync(
        `${buildDir}/json/${_edition}.json`,
        JSON.stringify(metadata, null, 2)
    );
  };


async function ipfsClient() {
    const ipfs = await create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https"
    });
    return ipfs;
}

async function saveFile(_data,_id){
    console.log(_data,_id)
    let ipfs = await ipfsClient();
    let img = fs.readFileSync("./images/"+_data['Image'])
    let options = {
        warpWithDirectory: false,
        progress: (prog) => console.log(`Saved :${prog}`)
    }
    let result = await ipfs.add(img, options);
    var CID = String(result['cid']);
    var url = "ipfs.io/ipfs/"+CID;
    addMetadata(url,_data['Title'],_data['Description'],_data['Category'],_data['SubCategory'],_id)
}

// Reading our test file
const file = reader.readFile('./info.xlsx')
let data = []
const sheets = file.SheetNames
for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]])
    temp.forEach((res) => {
        data.push(res)
    })
}



async function uploadFile(){
    let ipfs = await ipfsClient();

    let data = fs.readFileSync("./json/0.json")
    let options = {
        warpWithDirectory: false,
        progress: (prog) => console.log(`Saved :${prog}`)
    }
    let result = await ipfs.add(data, options);
    console.log(result);
}

// Printing data
data.map((res,id) => {
    saveFile(res,id)
})
uploadFile()