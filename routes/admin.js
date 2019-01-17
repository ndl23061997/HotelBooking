var express = require('express');
var router = express.Router();
var account = require('./admin/account')

router.use('/account', account);
module.exports = router;