var express = require('express');
var router = express.Router();
var serviceTypeModel = require('../../../models/admin/service/servicetype');
var serviceModel = require('../../../models/admin/service/service')
// Upload models la moudle custom tu multer
var uploadModels = require('../../../models/upload');
uploadModels.changeFolder('admin/service/');

router.get('/service', (req, res)=> {
    let data_render = {
        title : 'Thêm mới dịch vụ',
        check : 'nav-service'
    }

    serviceTypeModel.getAllServiceType((result, datas) => {
        data_render.servicetypes = datas;
        // console.log('add service router line 14: \n', data_render);
        res.render('admin/service/add/service', data_render);
    })
})

router.post('/service', uploadModels.upload.array('images', 3), (req, res) => {
    let data = req.body;

    if (req.files) {
        let filePath = req.files.map(file => file.path.substring(7));
        data.image = JSON.stringify(filePath);
        serviceModel.addService(data, (result)=> {
            if(result) {
                req.flash('message1', 'Thêm dịch vụ thành công');
            } else {
                req.flash('message2', 'Có lỗi xảy ra, vui lòng thử lại');
            }
            res.redirect('/admin/service/list/service');
        })
    } else {
        req.flash('message2', 'Có lỗi xảy ra, vui lòng thử lại');
        res.redirect('../list/service');
    }
    

});

router.get('/service-type', (req, res)=> {
    let data_render = {
        title : 'Thêm mới dịch vụ',
        check : 'nav-service'
    }
    res.render('admin/service/add/service-type', data_render);
})

router.post('/service-type', (req, res) => {
    let data = {};
    data.name = req.body.name;
    data.des = req.body.des;
    serviceTypeModel.addServiceType(data, (result)=> {
        if(result) {
            req.flash('message1', 'Thêm loại dịch vụ thành công');
        } else {
            req.flash('message2', 'Có lỗi xảy ra, vui lòng thử lại');
        }
        res.redirect('/admin/service/list/service-type');
    })

});
module.exports = router;