var express = require('express');
var router = express.Router();
var loginModel = require('../../models/login/login');
var JwtHelper = require('../../helpers/JwtHelper');
var MongooseHelper = require('../../helpers/MongooseHelper');
// var jwt = require('jsonwebtoken');
var bcrypt = require('../../helpers/BcryptHelpers')

router.post('/', login);
router.get('/logout', logout);

function login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    loginModel.getAccountMobile(username, password, (ok, user)=> {
        console.log(user);
        if(ok) {
            user = JSON.stringify(user);
            user = JSON.parse(user);
            req.session.userInfo = user;
            let token = JwtHelper.syncToken(user);
            MongooseHelper.saveToken(token, user);
            // let token = my_jwt.syncToken({ id : user.id, username: user.username });
            let data = { auth : 'ok', token : token };
            console.log(data);
            
            res.json({ auth : 'ok', token : token });
        } else {
            res.json({auth : 'Tai khoan mat khau deo dung'});
        }
    });

}

function logout (req, res) {
    let token = req.headers["authorization"].split(" ")[1];
    console.log(token);
    
    MongooseHelper.removeToken({token : token }, (ok)=>{
        if(ok){
            console.log("send ok");
            res.json({result : "ok"})
        } else {
            console.log("send not ok");
            res.json({auth : "ok"})
        }
    });
    
}

router.get('/get-user-info', (req, res)=> {
    res.json(req.session.userInfo);
});

module.exports = router;