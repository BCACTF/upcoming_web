const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use('/static', express.static('static'));


app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get('/contact', function(req, res) {
    res.render('contact.ejs');
});

app.post('/register', function(req, res) {

});

app.get('/register', function(req, res) {
    res.render('register.ejs');
});

app.get('*', function(req, res) {
    res.render('index.ejs');
});


const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log(`Info: Server started listening on port ${port}!`);
});