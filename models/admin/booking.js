var mysql = require("../../helpers/MySqlHelper");
module.exports.getListBooked = (id, cb) => {
  mysql.conn.query(
    "select * from plan where room_id = ? and check_out >= CURDATE()",
    [id],
    (err, datas) => {
      let listDate = [];
      console.log(datas);

      datas.forEach(elment => {
        console.log(elment.id);
        
        let check_in = new Date(elment.check_in);
        let check_out = new Date(elment.check_out);
        while (check_in <= check_out) {
          listDate.push(check_in.toLocaleDateString("en-GB"));
          check_in.setDate(check_in.getDate() + 1);
        }
      });
      console.log("list date booked room :", listDate);
      cb(listDate);
    }
  );
};

module.exports.checkDate = (roomid, checkin, checkout, cb) => {
  let ci = new Date(checkin);
  let co = new Date(checkout);
  if(ci < new Date() + 1 || co < new Date() + 1) return cb(false);
  let query =
    "select * from plan where room_id = ? and (( ? between check_in and check_out)" +
    " or ( ? between check_in and check_out))";
    //console.log(roomid, checkin,checkout);
    
  mysql.conn.query(query, [roomid, ci, co], (err, result) => {
    console.log(result);
    if (err) return cb(false);
    if (result.length > 0) return cb(false);
    else return cb(true);
  });
};


module.exports.addBooking = (data, cb) => {
  let query = "call add_booking(?,?,?,?,?)";
  let data2 = [data.idroom, data.idcustomer, new Date(data.checkin), new Date(data.checkout), data.currency];
  console.log('dobooking', data2);
  mysql.conn.query(query, data2, (err, result) => {
    console.log('addBooking rsult' , result);
    if(err) {
      console.log('addBooking Error' , err);
      cb(false);
    }
    if(result[0][0]) cb(true);
    else cb(false);
  })
}

module.exports.getDetailBooking = (idbooking, cb) => {
  let query = 
    "select booking.*, hotel.name as hotel_name, room.maso as maphong, " + 
    "customer.name as customer_name, DATE_FORMAT(check_in, '%d/%m/%Y') as check_in, DATE_FORMAT(check_out, '%d/%m/%Y') as check_out " +
    "from booking inner join customer on customer_id = customer.id " +
      "inner join hotel on hotel_id = hotel.id " +
      "inner join room on room_id = room.id " +
    "where booking.id = ? and status = 0";
  mysql.conn.query(query, [idbooking] , (err, done) => {
    if(err) {
      console.log('#getDetailBooking Error : \n', err);
      return cb(null);
    }
    console.log(done);
    cb(done);
  })
}

module.exports.getDetailRoomUse = (idbooking, cb) => {
  let query = 
    "select booking.*, hotel.name as hotel_name, room.maso as maphong, " + 
    "customer.name as customer_name, DATE_FORMAT(check_in, '%d/%m/%Y') as check_in, DATE_FORMAT(check_out, '%d/%m/%Y') as check_out " +
    "from booking inner join customer on customer_id = customer.id " +
      "inner join hotel on hotel_id = hotel.id " +
      "inner join room on room_id = room.id " +
    "where booking.id = ? and status = 1";
  mysql.conn.query(query, [idbooking] , (err, done) => {
    if(err) {
      console.log('#getDetailBooking Error : \n', err);
      return cb(null);
    }
    console.log(done);
    cb(done);
  })
}