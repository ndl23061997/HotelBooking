var express = require('express');
var router = express.Router();
var serviceTypeModel = require('../../../models/admin/service/servicetype');
var serviceModel = require('../../../models/admin/service/service')
var createError = require('http-errors');
var fs = require('fs');

router.get('/service/:id', (req, res, next) => {
    let id = req.params.id;
    if (!id) {
        next(createError(404, 'Không tìm thấy dịch vụ này'))
    }
    serviceModel.deleteService(id, (result) => {
        if (result) {
            req.flash('message1', 'Xóa thành công');
        } else {
            req.flash('message2', 'Có lỗi xảy ra, vui lòng thử lại');
        }
        res.redirect('/admin/service/list/service');
    })
})


router.post('/image-service', (req, res) => {
    let id = req.body.id;
    serviceModel.getServiceByID(id, (result, data) => {
        fs.unlink('uploads' + req.body.image, (err) => {

            let newdata = data;
            newdata.image = JSON.parse(newdata.image);
            newdata.image.splice(newdata.image.indexOf(req.body.image), 1);
            newdata.image = JSON.stringify(newdata.image);

            serviceModel.updateService(req.body.id, newdata, (result) => {
                if (result) {
                    res.status(200);
                    res.send('Xóa ảnh thành công')
                } else {
                    res.status(200);
                    res.send('Có lỗi xảy ra');
                }
            })
        })

    })
})

router.get('/service-type/:id', (req, res) => {
    let id = req.params.id;
    if (!id) {
        next(createError(404, 'Không tìm thấy loại dịch vụ này'))
    }
    serviceTypeModel.deleteServiceType(id, (result) => {
        if (result) {
            req.flash('message1', 'Xóa thành công');
        } else {
            req.flash('message2', 'Có lỗi xảy ra, vui lòng thử lại');
        }
        res.redirect('/admin/service/list/service-type');
    })

})



module.exports = router;