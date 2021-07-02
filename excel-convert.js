const excelToJSON = require('convert-excel-to-json');
const fs = require('fs');

const resultJSON = excelToJSON({
    sourceFile: 'Data Files/hds_Raject.xlsx'
});


// Rename Keys

let firstKeys = Object.keys(resultJSON);

let cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y"];

for (var i = 0; i < firstKeys.length; i++) {
    let aCol = resultJSON[firstKeys[i]][0]["A"];
    let bCol = resultJSON[firstKeys[i]][0]["B"];
    let cCol = resultJSON[firstKeys[i]][0]["C"];
    let dCol = resultJSON[firstKeys[i]][0]["D"];
    let eCol = resultJSON[firstKeys[i]][0]["E"];
    let fCol = resultJSON[firstKeys[i]][0]["F"];
    let gCol = resultJSON[firstKeys[i]][0]["G"];
    let hCol = resultJSON[firstKeys[i]][0]["H"];
    let iCol = resultJSON[firstKeys[i]][0]["I"];
    let jCol = resultJSON[firstKeys[i]][0]["J"];
    let kCol = resultJSON[firstKeys[i]][0]["K"];
    let lCol = resultJSON[firstKeys[i]][0]["L"];
    let mCol = resultJSON[firstKeys[i]][0]["M"];
    let nCol = resultJSON[firstKeys[i]][0]["N"];
    let oCol = resultJSON[firstKeys[i]][0]["O"];
    let pCol = resultJSON[firstKeys[i]][0]["P"];
    let qCol = resultJSON[firstKeys[i]][0]["P"];
    let rCol = resultJSON[firstKeys[i]][0]["R"];
    let sCol = resultJSON[firstKeys[i]][0]["S"];
    let tCol = resultJSON[firstKeys[i]][0]["T"];
    let uCol = resultJSON[firstKeys[i]][0]["U"];
    let vCol = resultJSON[firstKeys[i]][0]["V"];
    let wCol = resultJSON[firstKeys[i]][0]["W"];
    let xCol = resultJSON[firstKeys[i]][0]["X"];
    let yCol = resultJSON[firstKeys[i]][0]["Y"];

    let vals = [aCol, bCol, cCol, dCol, eCol, fCol, gCol, hCol, iCol, jCol, kCol, lCol, mCol, nCol, oCol, pCol, qCol, rCol, sCol, tCol, uCol, vCol, wCol, xCol, yCol];

    for (var key in resultJSON[firstKeys[i]]) {
        if (key != 0) {
            for (var j = 0; j < cols.length; j++) {
                if (resultJSON[firstKeys[i]][key][cols[j]]) {
                    resultJSON[firstKeys[i]][key][vals[j]] = resultJSON[firstKeys[i]][key][cols[j]];
                    delete resultJSON[firstKeys[i]][key][cols[j]];
                }
            }
        }
        //delete resultJSON[firstKeys[i]][0];
   }
}

module.exports = resultJSON;