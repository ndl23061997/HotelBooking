var express = require("express");
var router = express.Router();
var createError = require("http-errors");
var bcrypt = require('../helpers/BcryptHelpers');
var mysql = require('../helpers/MySqlHelper');


router.get("/", getLogin);
router.post("/", postLogin);
function getLogin(req, res, next) {
  res.render("login/login");
}

function postLogin(req, res) {
  let data = req.body;
  mysql.conn.query('select * from account where username = ?', [data.username], (err, done) => {
    if(err) {
      console.log(err);
      res.json({ok : false , message : 'Không tồn tại tài khoản!'});
      return;
    }
    console.log('PostLogin \n', done);
    if(done.length < 1) {
      res.json({ok : false , message : 'Không tồn tại tài khoản!'});
      return;
    }
    let acc = done[0];
    bcrypt.compare(data.password, acc.password,(err, same) => {
      if(err) {
        console.log(err);
        res.json({ok : false , message : 'Mật khẩu không chính xác!'});
        return;
      }
      if (same) {
        // Nếu đúng mật khẩu
        acc = JSON.stringify(acc);
        acc = JSON.parse(acc);
        req.session.acc = acc;
        if (acc.type == 0) {
          res.json({ ok: true, url: "/admin/room_use" });
          return;
        } else if (acc.type == 2) {
          res.json({ ok: true, url: "/user" });
          return;
        }

      } else {
        res.json({ ok: false, message: 'Mật khẩu không chính xác!' });
      }
    })
  })

}
module.exports = router;
