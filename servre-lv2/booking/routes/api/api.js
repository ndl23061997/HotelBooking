var express = require('express');
var router = express.Router();
var newRouter = require('./news');
var hotelRouter = require('./hotel');
var roomRouter = require('./room');
var bookingRouter = require('./booking');
var loginRouter = require('./login');
var auth = require('../auth');

router.use('/login', auth.checkLoginMobile,  loginRouter);
router.use('/news', newRouter);
router.use('/hotel', hotelRouter);
router.use('/room', roomRouter);
router.use('/booking',  bookingRouter);

module.exports = router;