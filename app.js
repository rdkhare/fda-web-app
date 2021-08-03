const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const exphbs = require('express-handlebars');
var https = require('https')
var path = require('path');
var fs = require('fs');
const resultJSON = require('./excel-convert');

// Handlebars Middleware
app.engine('handlebars', exphbs(
    {defaultLayout: 'main', helpers: {
        trimString: function(passedString) {
            var theString = passedString.substring(0,120) + "...";
            return theString;
        },
        checkLength: function(v1, v2, options) {
            if (v1.length>v2) {
                return options.fn(this);
             }
            return options.inverse(this);
        },
        ifnoteq: function(a, b, options) {
            if (a != b) { 
                return options.fn(this); 
            }
            return options.inverse(this);
        },
        ifEquals: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
    }}
    ));
app.set('view engine', 'handlebars');


const logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
}

app.use(logger);

// Homepage Route

let HDS = resultJSON["HDS"];

// Parse Title and Content in JSON

var dictsArray = [];
for (var ind in HDS) {
    var dictArr = [];
    if (HDS[ind]["AA"] && HDS[ind]["AB"]) {
        // titleArr.push("Uses");
        // contentArr.push("N/A");
        //titlesArray.push(titleArr);
        //contentsArray.push(contentArr);
    }
    if (HDS[ind]["Title_tox"]) {
        var title_val = HDS[ind]["Title_tox"];
        var content_val = HDS[ind]["Content_tox"]
        // make array of array that contains dictionaries with title and content
        var titles = title_val.split(",");
        var contents  = content_val.split(",,");
        for (var index in titles) {
            var dict = {};
            dict["title"] = titles[index];
            dict["content"] = contents[index];
            dictArr.push(dict);
        }
        //titlesArray.push(title_val.split(","));
        //contentsArray.push(content_val.split(",,"));
    }
    dictsArray.push(dictArr);
}

// console.log(dictsArray);

app.get('/', (req, res) => res.render('index', {
    title: 'LiverTox',
    HDS,
    style: "style.css",
    path: "home",
}));

// End Homepage Route

// Cases Route

let cases = resultJSON["Cases"];

/* References JSON for PUBMED

About: 

indices correspond to each HDS element
each index has a dictionary

Example: 

referencesDict = {{...},{...}, etc}

dictionary format for referencesDict:

{
    title: title, // titles of each case
    reference: reference // reference link for each case
}

If this doesn't work, then make dictionary inside of a dictionary for each title and reference

*/

function remove_duplicates_safe(arr) {
    var seen = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        if (!(arr[i] in seen)) {
            ret_arr.push(arr[i]);
            seen[arr[i]] = true;
        }
    }
    return ret_arr;

}

var referencesArr = [];

for (const index in HDS) {
    var referencesArr2 = [];
    if (index != 0) {
        var case_titles = [];
        var case_references = [];
        let name = HDS[index]["HDS_Name"];
        for (const num in cases) {
            if (num != 0) {
                let case_name = cases[num]["HDS_Name"];
                if (case_name.normalize() === name.normalize()) {
                    let case_title = cases[num]["Title"];
                    let case_reference = cases[num]["Reference"];
                    case_titles.push(case_title);
                    case_references.push(case_reference);
                }
            }
        }

        case_titles = remove_duplicates_safe(case_titles);
        case_references = remove_duplicates_safe(case_references);

        for (var i in case_titles) {
            var case_dict = {};
            if (case_titles[i] == undefined) {
                case_dict["title"] = "";
                case_dict["reference"] = "";
            } else {
                case_dict["title"] = case_titles[i];
                case_dict["reference"] = case_references[i];
                
            }
            referencesArr2.push(case_dict);
        }

    }
    referencesArr.push(referencesArr2);
}

// console.log(referencesArr);

app.get('/cases', (req, res) => res.render('cases', {
    title: 'LiverTox',
    cases,
    style: "style.css",
    path: "cases",
}));

function findNameIndex(name) {
    for (const num in HDS) {
        if (num != 0) {
            let hds_name = HDS[num]["HDS_Name"];
            if (hds_name.toLowerCase() === name.toLowerCase()) {
                return num;
            }
        }
    }
}

for (const index in cases) {
    if (index != 0) {
        let name = cases[index]["HDS_Name"];
        let case_hds = cases[index];
        let new_name = name.replace(/ /g, '%20');
       
        var num = findNameIndex(name);
        let img_text = HDS[num]["Img_tox"];
        

        // if (img_text == "lol") {
        //     img_text = img_text.replace()
        // }

        app.get(`/${new_name}_case`, (req, res) => res.render('cases-plants', {
            title: `${name}`,
            case_hds,
            style: "plants.css",
            img_a: `${img_text}`,
            path: "cases",
        }));
    }
}

// HDS Page Setup


for (const index in HDS) {
    if (index != 0) {
        let name = HDS[index]["HDS_Name"];
        let new_HDS = HDS[index];
        let new_referencesArr = referencesArr[index];
        let new_dictsArr = dictsArray[index];
        let new_name = name.replace(/ /g, '%20')
        // if (index == 2) {
        //     console.log(name);
        //     console.log(new_referencesArr);
        // }
        app.get(`/${new_name}`, (req, res) => res.render('plants', {
            title: `${name}`,
            new_HDS,
            style: "plants.css",
            new_dictsArr,
            new_referencesArr,
            path: "home",
        }));
    }
}


app.use('/api', require('./routes/api/hds-data'))



// https setup

// https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
//   }, app)
//   .listen(process.env.PORT || 3000, () => console.log(`Server started on https://localhost:${port}`));

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  

// Set static folder
app.use(express.static('public'));



