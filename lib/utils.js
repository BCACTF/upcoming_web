const path = require('path');
const sqlite3 = require('sqlite3');
const util = require('util');

const lib = {};
const db = new sqlite3.Database(path.join(__dirname, "../data.db"));

db.serialize(() => {
    // language=SQLite
    db.run("CREATE TABLE IF NOT EXISTS subscriber_emails (id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(255), ip_address VARCHAR(16), date INTEGER)");

    // language=SQLite
    db.run("CREATE TABLE IF NOT EXISTS contact_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), email VARCHAR(255), subject VARCHAR(255), message TEXT);");
});

// Taken from chromium
lib.validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

lib.addToMailingList = function(email, ip_address, cb) {

    // language=SQLite
    const stmt = db.prepare("INSERT INTO subscriber_emails (email, ip_address, date) VALUES (?, ?, ?)");
    stmt.run(email, ip_address, Math.floor(Date.now() / 1000), (err) => {
       cb(err);
    });
    stmt.finalize();

};

lib.sendMessage = async function(name, email, subject, message) {
    // TODO: Actually send an email

    // language=SQLite
    const stmt = db.prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    await util.promisify(stmt.run.bind(stmt))(name, email, subject, message);
    stmt.finalize();
};

module.exports = lib;
