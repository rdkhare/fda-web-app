const resultJSON = require("./excel-convert");
const HDS = resultJSON["HDS"];
let https = require('https');
/*let subscriptionKey = 'f960f68128a442f1a2f86be2e3b2245d';
let host = 'api.bing.microsoft.com';
let path = '/v7.0/images/search';*/

const wiki = require("wikijs").default;

const exceljs = require('exceljs');

const got = require('got');
const { get } = require("./routes/api/hds-data");

var imagesArr = [];
var summaryArr = [];
var contentArr = [];
var titleArr = [];
contentArr.push("Content_tox");
titleArr.push("Title_tox");

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

// (async () => {
// 	try {

//     for (const name in wiki_names) {
//       let wiki = wiki_names[name];
//       if (wiki.localeCompare("N/A") == 0) {
//         //imagesArr.push("https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg");
//         summaryArr.push("No available text from wiki.");
//       } else {
//         //let img_query = "http://en.wikipedia.org/w/api.php?action=query&titles=" + wiki + "&prop=pageimages&format=json&pithumbsize=600&formatversion=2"
//         //console.log(query);
//         let summary_query = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=" + wiki;
//         const sum_response = await got(summary_query, {responseType: 'json'});
//         let sum_body = sum_response.body;
//         if (sum_body) {
//           let pageid = Object.keys(sum_body["query"]["pages"])[0];
//           if (sum_body["query"]["pages"][pageid]) {
//             let summary = sum_body["query"]["pages"][pageid]["extract"];
//             summaryArr.push(summary);
//           } else {
//             summaryArr.push("No available text from wiki. 2.0");
//           }
//         }
//         // const response = await got(img_query, {responseType: 'json'});
//         // let body = response.body;
//         // if (body) {
//         //   if (body["query"]["pages"][0]["thumbnail"]) {
//         //     let img_url = body["query"]["pages"][0]["thumbnail"]["source"];
//         //     imagesArr.push(img_url);
//         //   } else {
//         //     imagesArr.push("https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg");
//         //   }
//         // }
//       }

//     }

//     parseXSLX("Data Files/hds_Raject.xlsx");


// 		//=> '<!doctype html> ...'
// 	} catch (error) {
// 		console.log(error);
// 		//=> 'Internal server error ...'
// 	}
// })();

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
            // sheet.getColumn(24).values = imagesArr;
            // sheet.getColumn(25).values = summaryArr;
            sheet.getColumn(27).values = titleArr;
            sheet.getColumn(28).values = contentArr;
            //console.log(sheet.getColumn(24).values);
            return workbook.xlsx.writeFile('Data Files/hds_Raject.xlsx');
        });
    
}

(async() => {
  try {

    for (const num in wiki_names) {
      var name = wiki_names[num];

      if (name == "A%C3%A7a%C3%AD_palm") {
        name = name.replace("A%C3%A7a%C3%AD_palm", "Acai_palm");
      }

      console.log(name);

      await wiki({headers: {
        'User-Agent': 'LiverTox/1.0' 
      }}).page(name).then((page) => page.sections().then((sections) => {
        var titleString = "";
        var contentString = "";
        for (const index in sections) {
          // console.log(sections[index]);
          for (const [key, value] of Object.entries(sections[index])) {
            //getContent(sections[index][value]);
            if(value == "Uses" || value == "Other uses" || value == "Traditional medicine" || value == "Medicinal uses") {
              // loop through and find medicine ones, not normal uses
              // lowercase the content and see if "medic" is in the string so it includes only medicinal uses

              if (sections[index]["content"].toLowerCase().includes("medic")) {
                    var title = sections[index]["title"];
                    var content = sections[index]["content"];
                    titleString += title + ",";
                    contentString += content + ",,";
              }

              if (sections[index]["items"]) {
                for (var ind in sections[index]["items"]) {
                  if (sections[index]["items"][ind]["content"].toLowerCase().includes("medic")) {
                    var title = sections[index]["items"][ind]["title"];
                    var content = sections[index]["items"][ind]["content"];
                    titleString += title + ",";
                    contentString += content + ",,";
                  }
                }
              }
            }
          }
        }
        titleArr.push(titleString);
        contentArr.push(contentString);
      }));
    }
    // parseXSLX call
    parseXSLX("Data Files/hds_Raject.xlsx");
  } catch(error) {
    console.log(error);
  }
})();

// getWikiContent("Acai");


// for (const index in wiki_names) {
//   console.log(wiki_names[index]);
// }