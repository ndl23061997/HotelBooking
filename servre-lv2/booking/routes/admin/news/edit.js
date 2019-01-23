var express = require('express');
var router = express.Router();
var uploadModel = require('../../../models/upload')
var newModel = require('../../../models/admin/news/news')

router.get('/:id', (req,res)=>{ 
    let id = req.params.id;

    let data_render = {
        title: 'Sửa tin tức',
        check: 'nav-news',
        message1: req.flash('message1'),
        message2: req.flash('message2')
    }
    newModel.getNew(id, (result, row)=> {
       
        let data = {
            id : req.params.id, 
            title : row.title,
            content : row.content,
            image : JSON.parse(row.image),
            priority : row.priority
        }
        data_render.data = data;
        console.log(data_render)
        res.render('admin/news/edit', data_render);
    })

});

router.post('/:id', uploadModel.upload.array('images', 3) , (req,res)=> {
    let filePath = req.files.map(file => file.path.substring(7));
    let id = req.params.id;
    let newData = req.body;
    newModel.getNew(id, (result, data2) => {
        data2.image = JSON.parse(data2.image);
        filePath.forEach(element => {
            data2.image.push(element);
        });
        newData.image = JSON.stringify(data2.image);
        console.log("##" , newData);
        newModel.updateNew(newData, (result) => {
            if (result) {
                req.flash('message1', 'Lưu lại thành công thành công');
            } else {
                req.flash('message2', 'Có lỗi xảy ra, vui lòng thử lại');
            }
            res.redirect('/admin/news/list');
        })
    })

})


module.exports = router;