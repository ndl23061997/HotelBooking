const mysql = require('mysql');
const config = require('../config/mysql_config')

const conn = mysql.createConnection(config.config);
conn.connect((err) => {
    if(err) console.log(err);
    else console.log("Connect success!");
    
})

function queryAwait (query, data = null) {
    return new Promise((resolve, reject) => {
        conn.query(query, data, (err, result) => {
            if(err) reject (err);
            else resolve(result);
        })
    });
}

module.exports = {
    conn, queryAwait
}