const resultJSON = require("./excel-convert");
const HDS = resultJSON["HDS"];
let https = require('https');
/*let subscriptionKey = 'f960f68128a442f1a2f86be2e3b2245d';
let host = 'api.bing.microsoft.com';
let path = '/v7.0/images/search';*/

const exceljs = require('exceljs');

const got = require('got');

var imagesArr = [];
var summaryArr = [];
imagesArr.push("Img_tox");
summaryArr.push("Summary_tox");

// //   for (const index in resultJSON["HDS"]) {
// //     if (index != 0) {
// //         let name = (resultJSON["HDS"][index]["HDS_Name"]);
// //         if (subscriptionKey.length === 32) {
// //           bing_image_search(name);
// //         } else {
// //             console.log('Invalid Bing Search API subscription key!');
// //             console.log('Please paste yours into the source code.');
// //         }
// //     }
// // }

var wiki_names = [];

for (const index in resultJSON["HDS"]) {
  if (index >= 1) {
    let name = (resultJSON["HDS"][index]["Wiki_Link"]);
    let wiki_name = name.split("/wiki/")
    if(wiki_name.length == 2) {
      wiki_names.push(wiki_name[1]);
    } else {
      wiki_names.push("N/A");
    }
    //wiki_names.push(wiki_name); 
  }
}

(async () => {
	try {

    for (const name in wiki_names) {
      let wiki = wiki_names[name];
      if (wiki.localeCompare("N/A") == 0) {
        //imagesArr.push("https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg");
        summaryArr.push("No available text from wiki.");
      } else {
        //let img_query = "http://en.wikipedia.org/w/api.php?action=query&titles=" + wiki + "&prop=pageimages&format=json&pithumbsize=600&formatversion=2"
        //console.log(query);
        let summary_query = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=" + wiki;
        const sum_response = await got(summary_query, {responseType: 'json'});
        let sum_body = sum_response.body;
        if (sum_body) {
          let pageid = Object.keys(sum_body["query"]["pages"])[0];
          if (sum_body["query"]["pages"][pageid]) {
            let summary = sum_body["query"]["pages"][pageid]["extract"];
            summaryArr.push(summary);
          } else {
            summaryArr.push("No available text from wiki. 2.0");
          }
        }
        // const response = await got(img_query, {responseType: 'json'});
        // let body = response.body;
        // if (body) {
        //   if (body["query"]["pages"][0]["thumbnail"]) {
        //     let img_url = body["query"]["pages"][0]["thumbnail"]["source"];
        //     imagesArr.push(img_url);
        //   } else {
        //     imagesArr.push("https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg");
        //   }
        // }
      }

    }

    parseXSLX("Data Files/hds_Raject.xlsx");


		//=> '<!doctype html> ...'
	} catch (error) {
		console.log(error);
		//=> 'Internal server error ...'
	}
})();

// module.exports = imagesArr;

// Function for reading XLSX, logging first column of first sheet

function parseXSLX(path) {
    // Create an instance of workbook to load data into
    const workbook = new exceljs.Workbook();
    // Read the file
    workbook.xlsx.readFile(path)
        .then(function(book) {
            // Get reference to first worksheet
            const sheet = book.getWorksheet(1);
            // Log the values of first column 
            sheet.getColumn(24).values = imagesArr;
            sheet.getColumn(25).values = summaryArr;
            //console.log(sheet.getColumn(24).values);
            return workbook.xlsx.writeFile('Data Files/hds_Raject.xlsx');
        });
    
}


