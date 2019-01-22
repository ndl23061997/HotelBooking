var createError = require('http-errors');

function authAdmin(err, req, res, next) {
    if (req.session.acc) {
        if(req.session.acc.type != 0) {
            return next(createError(403, 'Quyền truy cập bị hạn chế'))
        } else next();
    } else {
        res.redirect('/login');
    }
}

function authUser(req, res, next) {
    if (req.session.acc) {
        if (req.session.acc.type == 2) {
            next();
        } else {
            return next(createError(403, 'Quyền truy cập bị hạn chế'))
        }
    } else {
        res.redirect('/login');
    }
}

function authEmployee(req, res, next) {
    if (req.session.acc) {
        //console.log("Loai tai khoan", req.session.passport.user)
        if (req.session.acc.type == 0 || req.session.acc.type ==1) {
            next();
        } else {
            return next(createError(403, 'Quyền truy cập bị hạn chế'))
        }
    } else {
        res.redirect('/login');
    }
}

module.exports = { authAdmin, authUser, authEmployee }