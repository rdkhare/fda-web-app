const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const exphbs = require('express-handlebars');
var https = require('https')
var fs = require('fs')

// Handlebars Middleware

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Homepage Route

app.get('/', (req, res) => res.render('index', {
    title: 'LiverTox App'
}));

// https setup

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app)
  .listen(port, () => console.log(`Server started on port ${port}`));

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));
