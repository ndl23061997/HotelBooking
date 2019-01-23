var express = require('express');
var router = express.Router();
var auth = require('../auth');
var roomRouter = require('./room/room');
var serviceRouter = require('./service/service');
var newsRouter = require('./news/news');

//router.use(auth.checkLoginEmployee);


router.use('/room', roomRouter);
router.use('/service',serviceRouter );
router.use('/news', newsRouter);

// Trang chu
router.get('/', (req, res, next) => {
    data = {
        title : 'Trang chủ',
        check : 'nav-home'
    }
    res.render('admin/index', data);
})

module.exports = router;
