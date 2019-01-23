var express = require('express');
var router = express.Router();
var serviceModel = require('../../../models/admin/service/service')
var serviceTypeModel = require('../../../models/admin/service/servicetype')

// Danh sach dich vu
router.get('/service', (req, res) => {
    serviceModel.getAllService((result, datas) => {
        let data_render = {
            title: 'Danh sách dịch vụ',
            check: 'nav-service',
            message1: req.flash('message1'),
            message2: req.flash('message2')
        }
        data_render.datas = datas
        res.render('admin/service/list/service', data_render);
    })

})

// Danh sách loại dịch vụ
router.get('/service-type', (req, res) => {
    serviceTypeModel.getAllServiceType((result, datas) => {
        let data_render = {
            title: 'Danh sách dịch vụ',
            check: 'nav-service',
            message1: req.flash('message1'),
            message2: req.flash('message2')
        }
        data_render.datas = datas
        res.render('admin/service/list/service-type', data_render)
    });

})


module.exports = router;