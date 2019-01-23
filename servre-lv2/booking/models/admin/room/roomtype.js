var db = require('../../database')

function getAllRoomType(callback) {
    db.query('call get_all_roomtype()', (err, data, fields) => {
        if(err) {
            console.log(err)
            callback(false, null)
            return;
        }
        if (data && data[0].length > 0) {
            callback(true, data[0]);
        } else {
            callback(false, null);
        }
    });
}

function deleteRoomType(id, callback) {
    db.query('call delete_roomtype(?)', [id], (err, data, fields) => {
        if(err) {
            console.log(err)
            callback(false)
            return;
        }
        if (data && data['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}

function updateRoomType(id, newData, callback) {
    // console.log(HotelID, newData);
    db.query('call update_roomtype(?,?,?)', [id, newData.name, newData.des], (err, data, fields) => {
        if(err) {
            console.log(err);
            callback(false);
            return;
        }
        if (data['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}

function getRoomTypeByID(id,callback) {
    db.query('call get_roomtype(?)',[id],(err, data, fields) => {
        if(err) {
            console.log(err);
            callback(false);
            return;
        }
        if (data[0][0]) {
            // neu ton tai tai khoan
            callback(true, data[0][0]);
        } else {
            callback(false, null);
        }
    });
}



function addRoomType(newData, callback) {
    db.query('call add_roomtype(?,?)', [newData.name,newData.des], (err, data, fields) => {
        if(err) {
            console.log(err);
            callback(false);
            return;
        }
        if (data['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}
module.exports.addRoomType = addRoomType;
module.exports.getAllRoomType = getAllRoomType;
module.exports.deleteRoomType = deleteRoomType;
module.exports.updateRoomType = updateRoomType;
module.exports.getRoomTypeByID = getRoomTypeByID;