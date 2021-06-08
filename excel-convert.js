const excelToJSON = require('convert-excel-to-json');
const fs = require('fs');

const resultJSON = excelToJSON({
    sourceFile: 'Data Files/hds_Raject.xlsx'
});

module.exports = resultJSON;