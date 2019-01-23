var express = require('express');
var router = express.Router();

var listRouter = require('./list')
var editRouter = require('./edit')
var addRouter = require('./add')
var deleteRouter = require('./delete')

router.use('/list', listRouter)
router.use('/add', addRouter)
router.use('/delete', deleteRouter)
router.use('/edit', editRouter)

router.get('/', (req,res) => {
    res.redirect('/admin/news/list');
})
module.exports = router;