const basePath = process.cwd();
const buildDir = `${basePath}/`;
var metadataList = [];
var attributesList = [];
const fs = require("fs");
function addMetadata (_image,counter) {
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
        `${buildDir}/json/${counter}.json`,
        JSON.stringify(metadata, null, 2)
      );
  };

