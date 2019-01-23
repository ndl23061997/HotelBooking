var mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'hotel'
});



module.exports.getAllServiceType =  (callback) => {
    conn.query('call get_all_servicetype()' , (err, rows) => {
        if(err) {
            console.log('model `servicetype` line 15: \n', err);
            callback(false, null);
            return;
        } else {
            console.log('model `servicetype` line 18: \n', rows);
            callback(true, rows[0])
        }
    })

}

module.exports.getServiceTypeByID =  (id, callback) => {
    conn.query('call get_servicetype_by_id(?)' , [id], (err, rows) => {
        if(err) {
            console.log('model `servicetype` line 27: \n', err);
            callback(false, null);
            return;
        } else {
            if(rows[0].length > 0) callback(true, rows[0][0])
            else callback(false, null);
        }
    })
}

module.exports.deleteServiceType =  (id, callback) => {
    conn.query('call delete_servicetype(?)' , [id], (err, rows) => {
        if(err) {
            console.log('model `servicetype` line 39: \n', err)
            callback(false)
            return;
        }
        console.log('model `servicetype` line 43: \n', rows)
        if (rows['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}

module.exports.updateServiceType = (id, newData, callback) => {
    conn.query('call edit_servicetype(?,?,?)', [id,newData.name, newData.des], (err, rows) => {
        if(err) {
            console.log('model servicetype line 51: \n' ,err);
            callback(false);
            return;
        }
        if (rows['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}

module.exports.addServiceType = (data, callback) => {
    conn.query('call add_servicetype(?,?)', [data.name, data.des], (err, rows) => {
        if(err) {
            console.log('model servicetype line 64: \n' ,err);
            callback(false);
            return;
        }
        if (rows['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}