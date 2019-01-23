var mysql = require('mysql');
var util = require('util');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'hotel'
});

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    waitForConnections: true,
    database: 'hotel'
});
pool.query = util.promisify(pool.query);

module.exports = {conn, pool};