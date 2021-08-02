
const got = require("got");
const cheerio = require("cheerio");
const exceljs = require('exceljs');
const resultJSON = require("./excel-convert");
const HDS = resultJSON["HDS"];

var livertoxArr = [];
livertoxArr.push("LiverTox_summary");

(async() => {
    try {
        for (const index in HDS) {
            if (index >= 1) {
                let link = (HDS[index]["LiverTox_Link"]);
                if (link == "N/A" || link == undefined) {
                    livertoxArr.push("N/A");
                } else {
                        const response = await got(link);
                        const $ = cheerio.load(response.body);
                        // console.log(response.body);
                        var title = $("title").text();
                        var name = (title.split("-")[0]);
                        name = name.replace(/\s/g, '');
                        name = name.replace(/ *\([^)]*\) */g, "");
                        name = name.replace(/\./g,'');
                        name = name.replace(/'/g, '');
                        // console.log(name);
                        if (name == "PennyroyalOil") {
                            name = name.replace("PennyroyalOil", "Pennyroyal");
                        }
                        if (name == "PolygonumMultiflorum") {
                            name = name.replace("PolygonumMultiflorum", "ShouWuPian");
                        }
                        var res = $(`div[id="${name}.Hepatotoxicity"]`).html();
                        res = res.replace( /(<([^>]+)>)/ig, '\n');
                        res = res.replace("Hepatotoxicity", "");
                        livertoxArr.push(res);
                }
            }
        }
        parseXSLX("Data Files/hds_Raject.xlsx");
    } catch (error) {
        console.log(error);
        //=> 'Internal server error ...'
    }
})();

function parseXSLX(path) {
    // Create an instance of workbook to load data into
    const workbook = new exceljs.Workbook();
    // Read the file
    workbook.xlsx.readFile(path)
        .then(function(book) {
            // Get reference to first worksheet
            const sheet = book.getWorksheet(1);
            // Log the values of first column 
            sheet.getColumn(26).values = livertoxArr;
            //console.log(sheet.getColumn(24).values);
            return workbook.xlsx.writeFile('Data Files/hds_Raject.xlsx');
        });
    
}


