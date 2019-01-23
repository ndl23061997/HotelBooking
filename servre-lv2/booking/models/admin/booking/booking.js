var db = require('../../database')
const TAG = 'Nguyen Long - /models/admin/booking/booking.js \n';
module.exports.getBookingByRoom = (id, cb) => {
    db.query('call get_booking_by_room(?)', [id], (err, result)=> {
        if(err) {
            console.log(TAG, err);
            cb(false,null);
        } else {
            var affect = result[1];
            var rows = result[0];
            cb(true, rows);
        }
    });

} 

function addBooking (data, cb) {
    let data2 = [data.idroom, data.idcustomer, new Date(data.checkin), new Date(data.checkout), data.currency];
    db.query("call add_booking(?,?,?,?,?)", data2 , (err, result)=>{
        if(err) {
            console.log('addBooking Error' , err);
            cb(false);
          }
        if(result[0][0]) cb(true);
        else cb(false);
})
}

module.exports.addBooking = addBooking;