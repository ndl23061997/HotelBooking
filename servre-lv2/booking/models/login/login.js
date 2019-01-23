var db = require('../database')
var bcrypt = require('../../helpers/BcryptHelpers')


function getAccountByUsername(username, callback) {
    db.query('select * from account where username = ?', [username], (err, result) => {
        if(err) {
            console.log(err) 
            callback(false, null);
        }
        if (result[0][0]) {
            // neu ton tai tai khoan
            callback(true, result[0][0]);
        } else {
            callback(false, null);
        }
    });
}

function getAccount(username, password, callback) {
    db.query("select * from account where username = ?", [username], (err, result) => {
        if(err) {
            console.log(err);
            return callback(false, null);
        }
        // console.log('login model line 28 : \n' , data);
        if(bcrypt.compareSync(password, result[0].password)) {
            callback(true, result[0]);
        } else {
            callback(false, null);
        }
    });
}

function getAccountMobile (username , password, callback) {
    console.log(username, password);
    
    db.query('select * from account  inner join customer on customer.account_id = account.id  where account.username = ? limit 1', [username], (err, result)=> {
        if(err) {
            console.log(err);
            return callback(false, null);
        } else {
            console.log(result);
            if(bcrypt.compareSync(password, result[0].password)) {
                callback(true, result[0]);
            } else {
                callback(false, null);
            }
        }
    })
}

module.exports.getAccountByUsername = getAccountByUsername;
module.exports.getAccountMobile = getAccountMobile;
module.exports.getAccount = getAccount;