var mysql = require('../../helpers/MySqlHelper');

async function getListAccount() {
    return await mysql.queryAwait("select * from Account");
}

async function deleteAccount(id) {
    let result =  await mysql.queryAwait('delete from account where id = ?', [id]);
    if(result.affectedRows > 0) return true;
    else return false;
}

function addUser(data, cb) {
    let dateString = data.birthday.split('/');
    dateString = dateString.reverse().join('/')
    console.log(dateString);
    
    let birthday = new Date(dateString);
    
    let dataInsert = [data.username, data.password, data.name, data.gender, dateString, data.email, data.phone, data.address];
    console.log(dataInsert);
    
    mysql.conn.query('call add_user(?,?,?,?,?,?,?,?)', dataInsert, (err, result) => {
        if(err){
            console.log(err);
            return cb(false);
        } 
        if(result[0][0].ok) return cb(true);
        else return cb(false);
    }); 
}

module.exports = {
    getListAccount, 
    deleteAccount,
    addUser
}
