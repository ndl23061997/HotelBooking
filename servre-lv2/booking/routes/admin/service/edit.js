var createError = require('http-errors')
var express = require('express');
var router = express.Router();
var serviceTypeModel = require('../../../models/admin/service/servicetype');
var serviceModel = require('../../../models/admin/service/service')
var uploadModels = require('../../../models/upload');


router.get('/service/:id', (req, res, next) => {
    let id = req.params.id;
    let data_render = {
        title: 'Sửa dịch vụ',
        check: 'nav-service'
    }
    serviceTypeModel.getAllServiceType((result, datas) => {
        serviceModel.getServiceByID(id, (result, service_data) => {
            if (result) {
                data_render.servicetypes = datas;
                data_render.data = service_data;
                data_render.data.image = JSON.parse(service_data.images);

                res.render('admin/service/edit/service', data_render);
            } else {
                next(createError(404, 'Không tìm thấy dịch vụ này'));
            }
        })

    })
})

router.post('/service/:id', uploadModels.upload.array('images', 3), (req, res) => {
    let filePath = req.files.map(file => file.path.substring(7));
    let id = req.params.id;
    let newData = req.body;
    serviceModel.getServiceByID(id, (result, data2) => {
        data2.image = JSON.parse(data2.image);
        filePath.forEach(element => {
            data2.image.push(element);
        });
        newData.image = JSON.stringify(data2.image);
        serviceModel.updateService(id, newData, (result) => {
            if (result) {
                req.flash('message1', 'Lưu lại thành công thành công');
            } else {
                req.flash('message2', 'Có lỗi xảy ra, vui lòng thử lại');
            }
            res.redirect('/admin/service/list/service');
        })
    })

});


router.get('/service-type/:id', (req, res) => {
    let id = req.params.id;
    let data_render = {
        title: 'Sửa loại dịch vụ',
        check: 'nav-service'
    }
    serviceTypeModel.getServiceTypeByID(id, (result, data) => {
        data_render.data = data;
        res.render('admin/service/edit/service-type', data_render)
    });
})

router.post('/service-type/:id', uploadModels.upload.array('images', 3), (req, res) => {
    let id = req.params.id;
    let newData = {
        name: req.body.name,
        des: req.body.des
    }
    console.log('router edit service-type line 23: \n', id);
    serviceTypeModel.updateServiceType(id, newData, (result) => {
        if (result) {
            req.flash('message1', 'Lưu lại thành công thành công');
        } else {
            req.flash('message2', 'Có lỗi xảy ra, vui lòng thử lại');
        }
        res.redirect('/admin/service/list/service-type');
    })
});


module.exports = router;