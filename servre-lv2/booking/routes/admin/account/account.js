// Import Module
var express = require('express');
var router = express.Router();
//var auth = require('../../auth');

// Set Authorization

//router.use(auth.checkLoginAdmin);

// Router
var listRouter = require('./list');
var editRouter = require('./edit');
var addRouter = require('./add');
var deleteRouter = require('./delete');

// Set Router
router.use('/list', listRouter);
router.use('/add', addRouter);
router.use('/delete', deleteRouter);
router.use('/edit', editRouter);

router.get('/', (req, res) => {
    res.redirect('/admin/account/list');
});

module.exports = router;