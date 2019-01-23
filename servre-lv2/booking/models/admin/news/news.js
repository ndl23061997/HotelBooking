var db = require('../../database')
const TAG = 'Nguyen Long - /models/admin/news/news.js \n';
module.exports.getListNew = (callback) => {
    db.query('call get_all_new()', (err, rows) => {
        if (err) {
            console.log('model service line 15: \n', err);
            callback(false, null);
            return;
        } else {
            callback(true, rows[0])
        }
    })
}

module.exports.getListFrom = (from , callback)=> {
    db.query('call get_new_from(?)', [from], (err, result) => {
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


module.exports.getNew = (id, callback) => {
    db.query('call get_new(?)',[id], (err, rows) => {
        if (err) {
            console.log('model new line 25: \n', err);
            callback(false, null);
            return;
        } else {
            callback(true, rows[0][0])
        }
    })
}

module.exports.addNew = (data, callback) => {
    if(!data.priority) data.priority = 0;
    let data_add = [data.title, data.content, data.image, data.priority];
    console.log('**model news line 37 : ' + data_add)
    db.query('call add_new(?,?,?,?)', data_add , (err, rows) => {
        if (err) {
            console.log('model new line 38: \n', err)
            callback(false)
            return;
        }
        console.log('model new line 42: \n', rows)
        if (rows['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}


module.exports.updateNew = (data, callback) => {
    if(!data.priority) data.priority = 0;
    console.log(data);
    db.query('call edit_new(?,?,?,?,?)', [data.id, data.title, data.content, data.image, data.priority], (err, rows) => {
        if (err) {
            console.log('model new line 52: \n', err)
            callback(false)
            return;
        }
        console.log('model new line 56: \n', rows)
        if (rows['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}


module.exports.deleteNew = (id, callback) => {
    db.query('call delete_new(?)', [id], (err, rows) => {
        if (err) {
            console.log('model new line 66: \n', err)
            callback(false)
            return;
        }
        console.log('model new line 70: \n', rows)
        if (rows['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}