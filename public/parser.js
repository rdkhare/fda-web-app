// Require outside packages
const exceljs = require('exceljs');
var xslx_path = 'Data Files/hds_Raject.xlsx';
// Function for reading XLSX, logging first column of first sheet


function parseXSLX(path) {
    // Create an instance of workbook to load data into
    const workbook = new exceljs.Workbook();
    // Read the file
    workbook.xlsx.readFile(path)
        .then(function(book) {
            // Get reference to first worksheet
            var id_nums = [];
            const sheet = book.getWorksheet(1);
            // Log the values of first column 
            id_nums = (sheet.getColumn(1).values);
            console.log(id_nums);
        });
    
}

parseXSLX(xslx_path);