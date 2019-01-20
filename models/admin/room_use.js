const mysql = require("../../helpers/MySqlHelper");

module.exports = {
  getListRoomUse(cb) {
    let query =
      "select booking.*, hotel.name as hotel_name, " +
      "DATE_FORMAT(check_in, '%d/%m/%Y') as check_in, DATE_FORMAT(check_out, '%d/%m/%Y') as check_out " +
      "from booking inner join hotel on hotel_id = hotel.id " +
      "where check_out >= CURRENT_DATE() and check_in <= CURRENT_DATE() and status = 1";
    mysql.conn.query(query, (err, done) => {
      if (err) {
        console.log("getListRoomUse", err);
        return cb([]);
      }
      console.log(done);
      
      return cb(done);
    });
  }
};
