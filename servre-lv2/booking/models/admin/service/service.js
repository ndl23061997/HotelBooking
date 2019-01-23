var mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'hotel'
});



module.exports.getAllService = function getAllService(callback) {
    conn.query('call get_all_service()', (err, rows) => {
        if (err) {
            console.log('model service line 15: \n', err);
            callback(false, null);
            return;
        } else {
            callback(true, rows[0])
        }
    })

}

module.exports.getServiceByID = function getServiceByID(id, callback) {
    conn.query('call get_service_by_id(?)', [id], (err, rows) => {
        if (err) {
            console.log('model service line 27: \n', err);
            callback(false, null);
            return;
        } else {
            if (rows[0].length > 0) callback(true, rows[0][0])
            else callback(false, null);
        }
    })
}

module.exports.deleteService = function deleteService(id, callback) {
    conn.query('call delete_service(?)', [id], (err, rows) => {
        if (err) {
            console.log('model service line 39: \n', err)
            callback(false)
            return;
        }
        console.log('model service line 42: \n', rows)
        if (rows['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}

module.exports.updateService = function updateService(id, newData, callback) {
    let data_update = [id, newData.maso, newData.name, newData.price, newData.type_id, newData.image, newData.des, newData.status];
    console.log('model service function updateService', data_update);
    conn.query('call edit_service(?,?,?,?,?,?,?,?)', data_update , (err, rows) => {
        if (err) {
            console.log('model service line 51: \n', err);
            callback(false);
            return;
        }
        if (rows['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}


module.exports.addService = (data, callback) => {
    let dataAdd = [data.maso, data.name, data.price, data.type_id, data.image, data.des, data.status]
    console.log('Model service line 68 : \n', dataAdd);
    conn.query('call add_service(?,?,?,?,?,?,?)', dataAdd, (err, rows) => {
        if (err) {
            console.log('**Error : model service line 64: \n', err);
            callback(false);
            return;
        }
        if (rows['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}