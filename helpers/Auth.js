var createError = require('http-errors');

function checkLoginAdmin(err, req, res, next) {
    if (req.isAuthenticated()) {
        //console.log("Loai tai khoan", req.session.passport.user)
        if (req.session.passport.user.type == 0) {
            next();
        } else {
            return next(createError(403, 'Quyền truy cập bị hạn chế'))
        }
    } else {
        res.redirect('/login');
    }
}

function checkLoginUser(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.session.passport.user.type == 2) {
            next();
        } else {
            return next(createError(403, 'Quyền truy cập bị hạn chế'))
        }
    } else {
        res.redirect('/login');
    }
}

function checkLoginEmployee(req, res, next) {
    if (req.isAuthenticated()) {
        //console.log("Loai tai khoan", req.session.passport.user)
        if (req.session.passport.user.type <= 1) {
            next();
        } else {
            return next(createError(403, 'Quyền truy cập bị hạn chế'))
        }
    } else {
        res.redirect('/login');
    }
}

module.exports = { checkLoginAdmin, checkLoginEmployee, checkLoginUser }