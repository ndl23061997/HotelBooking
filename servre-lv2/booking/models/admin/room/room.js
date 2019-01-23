var db = require('../../database');


function getAllRoom(callback) {
    db.query('call get_all_room()', (err, data, fields) => {
        if(err) {
            console.log(err)
            callback(false, null)
            return;
        }
        if (data[0].length > 0) {
            callback(true, data[0]);
        } else {
            callback(false, null);
        }
    });
}

function deleteRoom(roomID, callback) {
    db.query('call delete_room(?)', [roomID], (err, data, fields) => {
        if (data && data['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}

function updateRoom(roomID, newData, callback) {
    //console.log(roomID, newData);
    db.query('call update_room(?,?,?,?,?,?,?)', [roomID, newData.hotel_id, newData.price, newData.type_id, newData.des, newData.image, newData.maso], (err, result, fields) => {
        if(err) {
            console.log(err)
            callback(false)
            return;
        }
        console.log('ket qua call update_room : ')
        console.log(result);
        if (result['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}

function getRoomByID(roomID, callback) {
    db.query('call get_room(?)', [roomID], (err, data, fields) => {
        //console.log(data);
        if(err) {
            console.log(err);
            callback(false, null)
            return;
        }
        if (data[0][0]) {
            // console.log(data)
            callback(true, data[0][0])
        } else {
            callback(false,null);
        }
    });
}

function getTemplate(callback) {
    db.query('select id,name from roomtype', (err, data) => {

        if (err) {
            console.log(err);
            callback(false, null);
            return;
        }
        let roomtypes = data;
        db.query('select id, name, `MS01` as maso from roomtype', (err, data2) => {
            if (err){ 
                console.log(err);
                
                callback(false, null);}
            let hotels = data2;
            callback(true, { hotels: hotels, roomtypes: roomtypes });
        });
    });
}

async function getDetail(roomID, callback) {
    db.query('select id,name from roomtype', (err, data) => {
        let roomtypes = data;
        db.query('select id, name, maso from hotel', (err, data2) => {
            let hotels = data2;
            db.query('select * from room where id = ?', [roomID], (err, data3) => {
                let detail = data3;
                let result = {
                    detail: detail,
                    hotels: hotels,
                    roomtypes: roomtypes
                }
                console.log(result);
                
                callback(result)
            });
        });
    });


    // let promise1 = db.query('select id, name from roomtype');
    // let promise2 = db.query('select id, name from roomtype');
    // let promise3 = db.query('select * from Room where id =?', [roomID]);
    // const [result1, result2, result3] = await  Promise.all([promise1, promise2, promise3])
    // let result = {
    //     detail: result1,
    //     hotels: result2,
    //     roomtypes: result3
    // }
    // callback(result);

}

function addRoom(data, callback) {
    db.query('call add_room(?,?,?,?,?,?)', [data.hotel_id, data.price, data.type_id, data.des, data.image, data.maso], (err, result) => {
        if (err) {
            console.log(err);
            callback(false);
            return;
        }
        console.log('Kết quả call add_room : \n' , result);
        if (result['affectedRows'] > 0)
            callback(true);
        else callback(false);
    })
}
module.exports.addRoom = addRoom;
module.exports.getTemplate = getTemplate;
module.exports.getAllRoom = getAllRoom;
module.exports.deleteRoom = deleteRoom;
module.exports.getDetail = getDetail;
module.exports.updateRoom = updateRoom;
module.exports.getRoomByID = getRoomByID;