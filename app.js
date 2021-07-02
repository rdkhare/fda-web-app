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
        }
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

app.get('/', (req, res) => res.render('index', {
    title: 'LiverTox App',
    HDS,
    style: "style.css"
}));

// HDS Page Setup

for (const index in HDS) {
    if (index != 0) {
        let name = HDS[index]["HDS_Name"];
        let new_HDS = HDS[index];
        let new_name = name.replace(/ /g, '%20')
        app.get(`/${new_name}`, (req, res) => res.render('plants', {
            title: `${name}`,
            new_HDS,
            style: "plants.css"
        }));
    }
}


app.use('/api', require('./routes/api/hds-data'))

// https setup

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app)
  .listen(port, () => console.log(`Server started on https://localhost:${port}`));

// Set static folder
app.use(express.static('public'));


// console.log(resultJSON["HDS"][1])