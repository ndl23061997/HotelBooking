var express = require('express');
var router = express.Router();
var mysql = require('../../helpers/MySqlHelper')

router.get('/room-all', getReportRoom);
router.post('/service-all', getServiceAll);
router.post('/service-one', getServiceOne);
router.get('/service', getReportService);
router.get('/getlisthotel', getlsHotel);
router.get('/getlistservice', getlsService);

function getReportRoom(req, res) {

}
function getServiceAll(req, res) {
    let hotel = req.body.hotel;
    let query = 'select report_service.*, service.name as name from report_service inner join service on service_id = service.id where hotel_id = ? group by service_id'
    mysql.conn.query(query, [hotel], (err, done) => {
        console.log(done);
        res.json(done);
    }); 
}


function getServiceOne(req, res) {
    let hotel = req.body.hotel;
    let service = req.body.service;
    let query = 'select report_service.*, service.name as name from report_service inner join service on service_id = service.id where hotel_id = ? and service_id = ? group by service_id'
    mysql.conn.query(query, [hotel,service ], (err, done) => {
        console.log(done);
        res.json(done);
    }); 
}

function getReportService(req, res) {
    res.render('admin/report/report_service');
}

function getlsHotel(req, res) {
    mysql.conn.query('select * from hotel', (err, done) => {
        res.json(done);
    })
} 

function getlsService(req, res) {
    mysql.conn.query('select * from service', (err, done) => {
        res.json(done);
    })
}
module.exports = router;