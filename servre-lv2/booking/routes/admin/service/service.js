var express = require('express')
var router = express.Router()

var editRouter = require('./edit')
var addRouter = require('./add')
var listRouter = require('./list')
var deleteRouter = require('./delete')

router.use('/add', addRouter)
router.use('/edit', editRouter)
router.use('/delete', deleteRouter)
router.use('/list', listRouter)

module.exports = router;