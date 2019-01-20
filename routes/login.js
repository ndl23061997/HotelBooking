var express = require("express");
var router = express.Router();
var createError = require("http-errors");
var bcrypt = require('../helpers/BcryptHelpers');
var mysql = require('../helpers/MySqlHelper');


router.get("/", getLogin);
router.post("/", postLogin);
function getLogin(req, res, next) {
  res.render("login/login.ejs");
}

function postLogin(req, res) {
  let data = req.body;
  mysql.conn.query('select * from account where username = ?', [data.username], (err, done) => {
    if(err) {
      console.log(err);
      res.json({ok : false , message : 'Không tồn tại tài khoản!'});
    }
    console.log('PostLogin \n', done);
    let acc = done[0];
    if(bcrypt.compareSync(data.password, acc.password)) {
      // Nếu đúng mật khẩu
      acc = JSON.stringify(acc);
      acc = JSON.parse(acc);
      
    } else {
      res.json({ok : false , message : 'Mật khẩu không chính xác!'});
    }
  })

}
module.exports = router;
