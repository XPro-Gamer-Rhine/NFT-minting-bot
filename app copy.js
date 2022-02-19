const { create } = require("ipfs-http-client");
const fs = require("fs");
const reader = require('xlsx')
var counter = 0;
const basePath = process.cwd();
const buildDir = `${basePath}/`;
var metadataList = [];
var attributesList = [];

const addMetadata =  (_image,counter)=> {
    let dateTime = Date.now();
    let tempMetadata = {
      name: "Something",
      description: "Something Awesome",
      image: _image,
      edition: counter,
      date: dateTime,
      attributes: [{
        "trait_type": "Gender",
        "value": "Male"
      },
      {
        "trait_type": "Avatar",
        "value": "cartoon"
      }],
    };
   
    metadataList.push(tempMetadata);
    let metadata = metadataList.find((meta) => meta.edition == counter);
    fs.existsSync("json") || fs.mkdirSync("json");
    fs.writeFileSync(
        `${buildDir}/json/metadata.json`,
        JSON.stringify(metadataList, null, 2)
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
    counter++;
    let ipfs = await ipfsClient();

    let img = fs.readFileSync("./images/"+_imgPath)
    // let data = {
    //     image:img,
    //     title:"User",
    //     description:"This is the 1st image uploaded",
    //     category:"Human",
    //     subcategory:"male"
    // }
    let options = {
        warpWithDirectory: false,
        progress: (prog) => console.log(`Saved :${prog}`)
    }
    let result = await ipfs.add(img, options);
    // let result =await ipfs.add({
    //     path:"1",
    //     content:JSON.stringify(data),
    //     options
    // });
    var _data = String(result['cid']);
    var url = "ipfs.io/ipfs/"+_data;
    addMetadata(url,counter)
    console.log(_data);
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

// Printing data
data.map((res,id) => {
    saveFile(res,id)
    
})

// async function uploadFile(){
//     let ipfs = await ipfsClient();

//     let data = fs.readFileSync("./json/metadata.json")
//     let options = {
//         warpWithDirectory: false,
//         progress: (prog) => console.log(`Saved :${prog}`)
//     }
//     let result = await ipfs.add(data, options);
//     console.log(result);
// }

// uploadFile()