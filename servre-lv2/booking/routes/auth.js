var createError = require('http-errors');

var loginModel = require('../models/login/login');
var JwtHelper = require('../helpers/JwtHelper');
var MongooseHelper = require('../helpers/MongooseHelper');


function checkLoginAdmin(err, req, res, next) {
    if (req.isAuthenticated()) {
        //console.log("Loai tai khoan", req.session.passport.user)
        if (req.session.passport.user.type == 0) {
            next();
        } else {
            next(createError(403, 'Quyền truy cập bị hạn chế'))
        }

    } else {
        res.redirect('/login');
    }
}

function checkLoginUser(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

function checkLoginEmployee(req, res, next) {
    if (req.isAuthenticated()) {
        //console.log("Loai tai khoan", req.session.passport.user)
        if (req.session.passport.user.type == 0 | req.session.passport.user.type == 1) {
            next();
        } else {
            next(createError(403, 'Quyền truy cập bị hạn chế'))
        }

    } else {
        res.redirect('/login');
        //next(createError(403 , 'Quyền truy cập bị hạn chế'))

    }
}

module.exports.checkLoginMobile = (req, res, next) => {
    console.log(req.path, req.method, req.headers);

    
    if(req.path.indexOf('date-disable') >= 0 || req.path.indexOf('logout') >= 0 || req.path === "/"){
        console.log("denday ok");
         next();
         return;
    } 
    let token;
    console.log("vao day")
    if(req.headers["authorization"]) {
        token = req.headers["authorization"].split(" ")[1];
    }
    if(!token) return res.json({auth : "fail"});
    console.log(req.sessionID);
    if(!req.session.userInfo) {
        MongooseHelper.findToken(token, (ok, data) => {
            if(ok) {
                let user = JwtHelper.decode(token);
                console.log(user);
                if(!data) return   res.json({auth : "fail"})
                if(user.id === data.user.id) {
                    console.log("vao day");
                    req.session.userInfo = user;
                    return next()
                } else return res.json({auth : "fail"})
            } else {
                return res.json({auth : "fail"})
            }
        })
    } else {
        console.log("vao day");
        
        let user = JwtHelper.decode(token);
        if(user.id === req.session.userInfo.id) {
            return next();
        } else res.json({auth : "fail"})
    }
}


module.exports.checkLoginAdmin = checkLoginAdmin;
module.exports.checkLoginEmployee = checkLoginEmployee;
module.exports.checkLoginUser = checkLoginUser;