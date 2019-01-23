var express = require('express');
var router = express.Router();
var uploadModel = require('../../../models/upload')
var newModel = require('../../../models/admin/news/news')
router.get('/', (req, res) => {
    let data_render = {
        title: 'Thêm tin tức',
        check: 'nav-news',
        message1: req.flash('message1'),
        message2: req.flash('message2')
    }
    res.render('admin/news/add', data_render);
})

router.post('/', uploadModel.upload.array('images', 3), (req,res) => {
    let data = req.body;

    if (req.files) {
        let filePath = req.files.map(file => file.path.substring(7));
        data.image = JSON.stringify(filePath);
        console.log("** router add new line 21 : " + data.image);
        newModel.addNew(data, (result)=> {
            if(result) {
                req.flash('message1', 'Thêm tin tức thành công');
            } else {
                req.flash('message2', 'Có lỗi xảy ra, vui lòng thử lại');
            }
            res.redirect('/admin/news/list');
        })
    } else {
        req.flash('message2', 'Có lỗi xảy ra, vui lòng thử lại');
        res.redirect('../list/service');
    }
});

module.exports = router;