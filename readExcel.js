// Requiring the module
const reader = require('xlsx')

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
data.map((res) => {
    console.log(res['Image']);
})