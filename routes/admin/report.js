var express = require('express');
var router = express.Router();
var mysql = require('../../helpers/MySqlHelper')

router.get('/getlisthotel', getlsHotel);
// Report for service 
router.post('/rp-all-service', getReportAllService);
router.post('/rp-one-service', getReportOneService);
router.get('/service', getReportService);
router.get('/getlistservice', getlsService);
//#endregion

// Bao cao cho Phong
router.post('/rp-all-room', getReportAllRoom);
router.post('/rponeroom', getReportOneRoom);
router.get('/listroom/:hotel', getListRoom);
router.get('/room', getReportRoom);
//#endregion

function getListRoom(req, res) {
    let hotel = req.params.hotel;
    console.log(hotel);
    
    mysql.conn.query('select * from room where hotel_id = ?', [hotel], (err, done)=>{
        console.log(done);
        res.json(done);
    })
}

function getReportAllRoom(req, res) {
    let hotel = req.body.hotel;
    let month = req.body.month;
    let year = req.body.year;
    console.log(req.body);
    
    let query = `select report_room.* , sum(booking_money) as tt
                    from report_room  
                    where hotel_id = ${hotel} 
                    and MONTH(checkout) = ${month}
                    and YEAR(checkout) = ${year}
                group by room_id`
    mysql.conn.query(query, (err, done) => {
        console.log(done);
        res.json(done);
    }); 
}

function getReportOneRoom(req, res) {
    let hotel = req.body.hotel;
    let month = req.body.month;
    let year = req.body.year;
    let room = req.body.room;
    let query = `select * from report_room 
                where hotel_id = ${hotel}  
                and MONTH(checkout) = ${month} 
                and YEAR(checkout) = ${year} 
                and room_id = ${room}`;
    console.log(query);
                    
    mysql.conn.query(query, (err, done) => {
        console.log(done);
        res.json(done);
    }); 
}

function getReportRoom(req, res ) {
    res.render('admin/report/report_booking')
}

// Lay report 
function getReportAllService(req, res) {
    let hotel = req.body.hotel;
    let month = req.body.month;
    let year = req.body.year;
    let query = `select report_service.*, service.name as name 
            from report_service inner join service on service_id = service.id 
            where hotel_id = ? group by service_id
            and MONTH(checkout) = ${month}
            and YEAR(checkout) = ${year}
            `
    mysql.conn.query(query, [hotel], (err, done) => {
        console.log(done);
        res.json(done);
    }); 
}

// lay tho
function getReportOneService(req, res) {
    let hotel = req.body.hotel;
    let service = req.body.service;
    let month = req.body.month;
    let year = req.body.year;
    let query = `select report_service.*, service.name as name 
                from report_service inner join service on service_id = service.id 
                where hotel_id = ? and service_id = ?
                and MONTH(checkout) = ${month}
                and YEAR(checkout) = ${year}`
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