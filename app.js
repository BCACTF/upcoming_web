const express = require('express');
const bodyParser = require('body-parser');

const util = require('./lib/utils');

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
    
    const email = typeof(req.body.email) === 'string' && req.body.email.length > 0 && util.validateEmail(email) ? req.body.email : false;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if(email) {

        // Add to email list
        util.addToMailingList(email, ip, function(err, msg) {
            if(!err) {
                res.status(200).json({});
            } else {
                res.status(403).json({'Error': msg});
            }
        });

    } else {
        res.status(403).json({'Error': 'Missing required fields.'});
    }

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