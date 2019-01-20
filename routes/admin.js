var express = require('express');
var router = express.Router();
var account = require('./admin/account')
var booking = require('./admin/booking');
var room_use = require('./admin/room_use')
router.use('/account', account);
router.use('/booking', booking);
router.use('/room_use', room_use);
module.exports = router;