const GoogleSpreadsheet= require('google-spreadsheet');

let doc = GoogleSpreadsheet(process.env.GOOGLE_SHEETS_EMAIL_LIST_KEY, process.env.GOOGLE_SHEETS_AUTH_TOKEN);

const lib = {};

// Taken from chromium
lib.validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

lib.addToMailingList = function(email, ip_address, cb) {

    doc.addRow(process.env.GOOGLE_SHEETS_WORKSHEET_ID, {'email': email, 'date_added': Date.now(), 'ip_address': ip_address}, function(err, row) {

        if(!err && row) {
            cb(false, null);
        } else {
            cb(true, err);
        }

    });

};

module.exports = lib;