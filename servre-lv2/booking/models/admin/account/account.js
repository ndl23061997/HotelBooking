var db = require('../../database');
const TAG = 'Nguyen Long - /models/admin/account/account.js \n';

module.exports.getList = (callback) => {
    db.query('call get_all_account()', (err, result) => {
        let rows = result[0];
        if (err) {
            console.log(TAG, err);
            callback(false, null);
            return;
        } else {
            callback(true, rows);
        }
    })
}

module.exports.get = (id, callback) => {
    db.query('call get_account_by_id(?)',[id], (err, result) => {
        let rows = result[0];
        if (err) {
            console.log(TAG , err);
            callback(false, null);
            return;
        } else {
            if (rows.length > 0) {
                // neu ton tai tai khoan
                callback(true, rows[0]);
            } else {
                callback(false, null);
            }
        }
    })
}

module.exports.add = (data, callback) => {
    let data_add = [data.username, data.password, data.type];
    console.log(TAG, data_add);
    db.query('call add_account(?,?,?)', data_add , (err, result) => {
        if (err) {
            console.log(TAG, err)
            callback(false)
            return;
        }
        console.log(TAG, result)
        if (result['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}


module.exports.update = (data, callback) => {
    db.query('call edit_account(?,?,?)', [data.id, data.password, data.type], (err, result) => {
        let status = result[1];
        if (err) {
            console.log(TAG, err)
            callback(false)
            return;
        }
        if (status.affectedRows > 0)
            callback(true);
        else callback(false);
    })
}


module.exports.delete = (id, callback) => {
    db.query('call delete_account(?)', [id], (err, rows) => {
        if (err) {
            console.log(TAG, err)
            callback(false)
            return;
        }
        if (status.affectedRows > 0)
            callback(true);
        else callback(false);
    })
}