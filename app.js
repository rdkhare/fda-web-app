const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const exphbs = require('express-handlebars');
var https = require('https')
var fs = require('fs');
const resultJSON = require('./excel-convert');

// Handlebars Middleware

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
}

app.use(logger);

// Homepage Route

app.get('/', (req, res) => res.render('index', {
    title: 'LiverTox App'
}));

// API Requests

app.get('/api/hds-data', function(req, res) {
    res.json(resultJSON["HDS"]);
});
app.get('/api/cases-data', (req, res) => res.json(resultJSON["Cases"]));
app.get('/api/abstracts-data', (req, res) => res.json(resultJSON["Abstract"]));



// https setup

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app)
  .listen(port, () => console.log(`Server started on port ${port}`));

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));
