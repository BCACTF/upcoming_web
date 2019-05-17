const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const util = require('./lib/utils');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/static', express.static('static'));

const faq = require('./data/faq.json');

app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get('/about', function(req, res) {
    res.render('about.ejs');
});

app.get('/faq', function(req, res) {
    res.render('faq.ejs', {faq});
});

app.get('/contact', function(req, res) {
    res.render('contact.ejs');
});

app.get('/rules', function(req, res) {
    res.render('rules.ejs');
});

app.get('/get-started', function(req, res) {
    res.render('get-started.ejs');
});

app.get('/login', function(req, res) {
    res.render('login.ejs');
});

app.post('/subscribe', function(req, res) {

    const email = typeof(req.body.email) === 'string' && req.body.email.length > 0 && util.validateEmail(req.body.email) ? req.body.email : false;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if(email) {

        // Add to email list
        util.addToMailingList(email, ip, function(err, msg) {
            if(!err) {
                res.status(200).render('subscribed.ejs');
            } else {
                res.status(500).text("Internal server error. We have been notified of the problem.");
                console.log(msg);
            }
        });

    } else {
        res.status(403).text("Missing required fields. Please try again.");
    }

});

app.get('/register', function(req, res) {
    res.render('register.ejs');
});

app.get('*', function(req, res) {
    res.redirect('/');
});


const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log(`Info: Server started listening on port ${port}!`);
});