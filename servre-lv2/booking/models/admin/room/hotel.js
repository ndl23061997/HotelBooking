var db = require('../../database')

function getAllHotel(callback) {
    db.query('call get_all_Hotel()', (err, data, fields) => {
        console.log(data[1].affectedRows);
        if(err) {
            console.log(err)
            callback(false, null)
            return;
        }
        if (data[0].length > 0) {
            // neu ton tai tai khoan
            callback(true, data[0]);
        } else {
            callback(false, null);
        }
    });
}

function deleteHotel(HotelID, callback) {
    db.query('call delete_hotel(?)', [HotelID], (err, data, fields) => {
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

function updateHotel(HotelID, newData, callback) {
    // console.log(HotelID, newData);
    db.query('call update_hotel(?,?,?,?,?,?)', [HotelID, newData.name, newData.location, newData.image, newData.des, newData.maso], (err, data, fields) => {
        if(err) {
            console.log(err);
            callback(false);
            return;
        }
        console.log(data);
        if (data['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}

function getHotelByID(HotelID,callback) {
    db.query('call get_hotel(?)',[HotelID],(err, data, fields) => {
        if (data[0][0]) {
            // neu ton tai tai khoan
            callback(true, data[0][0]);
        } else {
            callback(false, null);
        }
    });
}



function addHotel(newData, callback) {
    db.query('call add_hotel(?,?,?,?,?)', [newData.name, newData.location, newData.image, newData.des, newData.maso], (err, data, fields) => {
        if(err) {
            console.log(err);
            callback(false);
            return;
        }
        console.log(data);
        if (data['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}
module.exports.addHotel = addHotel;
module.exports.getAllHotel = getAllHotel;
module.exports.deleteHotel = deleteHotel;
module.exports.updateHotel = updateHotel;
module.exports.getHotelByID = getHotelByID;