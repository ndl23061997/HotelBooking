var express = require('express');
var router = express.Router();
var newModel = require('../../../models/admin/news/news')

router.get('/', (req, res) => {
    newModel.getListNew((result, datas)=> {
        if(result) {
            let data_render = {
                title: 'Danh tài khoản tin mới',
                check: 'nav-news',
                message1: req.flash('message1'),
                message2: req.flash('message2')
            }
            data_render.datas = datas;
            res.render('admin/news/list', data_render);
            
        }
    })
});



module.exports = router;