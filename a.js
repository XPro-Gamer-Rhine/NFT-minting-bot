var fs = require('fs');
var files = fs.readdirSync('./build/images/');

const fs = require('fs');
const fileName = './build/json/1.json';
const file = require(fileName);
    
file.image = "new value";
    
fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
  if (err) return console.log(err);
  console.log(JSON.stringify(file));
  console.log('writing to ' + fileName);
});
