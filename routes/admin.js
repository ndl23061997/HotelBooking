var express = require('express');
var router = express.Router();

// router
var accountRouter  = require('./admin/account')
var bookingRouter  = require('./admin/booking');
var room_useRouter = require('./admin/room_use');
var discountRouter = require('./admin/discount')
var reportRouter = require('./admin/report')
// auth
var auth = require('../helpers/Auth');

// setup auth
router.use(auth.authEmployee);

// setup router
router.use('/account',  accountRouter );
router.use('/booking',  bookingRouter );
router.use('/room_use', room_useRouter);
router.use('/discount', discountRouter);
router.use('/report', reportRouter);

module.exports = router;