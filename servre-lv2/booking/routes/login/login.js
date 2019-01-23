var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var loginModel = require('../../models/login/login');
var part_redirect = '/';


router.post('/',
    passport.authenticate('local-login', {
        failureRedirect: '/login',
        failureFlash: true
    }), (req, res) => {
        switch (req.user.type) {
            case 0:
                part_redirect = '/admin'
                break;
            case 1:
                part_redirect = '/employee'
                break;
            default:
                part_redirect = '/'
                break;
        }
        res.redirect(part_redirect);
    }
);

//router.use(checkLogin);
router.get('/', (req, res) => {
    res.render('login/login', { message: req.flash('message') });
})

// Kiem tra thong tin dang nhap. 
function checkLogin(req, res, next) {
    // Neu tai khoan da dc login truoc do
    if (req.isAuthenticated()) {
        // Kiem tra loại tài khoản
        switch (req.session.passport.user.type) {
            case 0:
                res.redirect('/admin');
                break;
            case 1:
                res.redirect('/employee');
                break;
            default:
                res.redirect('/user');
                break;
        }
    } else {
        next();
    }
}

module.exports = router;
