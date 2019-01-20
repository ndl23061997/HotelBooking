var express = require('express');
var router = express.Router();
const mysql = require('../../helpers/MySqlHelper');
var model = require('../../models/admin/booking');

// GET 
router.get('/', listBooking);
router.get('/add', addBooking);
router.get('/data/:method', getData);
router.get('/detail/:idbooking', detailBooking);
// POST DATA
router.post('/add', doBooking);
router.post('/delete', doDeleteBooking);
router.post('/apply', applyBooking);
// Dat phong
function doBooking(req, res) {
    let data = req.body;
    data['currency'] = 'VND';
    model.addBooking(data, (result) => {
        res.json(result);
    })
}


// Giao phong cho khach
function applyBooking(req, res) {
    let id = req.body.id;

    mysql.conn.query('call apply_booking(?)', [id], (err, done) => {
        if(err) {
            console.log('applyBooking error : \n', err);
            return res.json(false);
        }
        done = JSON.stringify(done);
        done = JSON.parse(done);
        console.log('applyBooking done : \n' ,done[0][0].ok);
        if(done[0][0].ok == 1) {
            res.json({error : false});
        } else res.json({error : true, message:"Thất bại,Chưa đến thời gian nhận phòng!"});
    })
}

// Chi tiet don dat phong
function detailBooking (req, res){
    let idbooking = req.params.idbooking;
    model.getDetailBooking(idbooking, (result) => {
        let data = result[0];
        res.render('admin/booking/booking_detail', {data : data});
    })
}
// Huy don dat phong
function doDeleteBooking (req, res) {
    let id = req.body.id;
    mysql.conn.query('call cancel_booking(?)', [id], (err, done) => {
        if(err) {
            console.log(err);
            res.json({ok: false});
            return;
        }

        done = JSON.stringify(done);
        done = JSON.parse(done);
        if(done.affectedRows > 0) {
            res.json({ok: true})
        } else res.json({ok: false})
        return;
    });
}

// Lay danh sach dat phong
function listBooking(req, res) {
    let query = 'SELECT *, DATE_FORMAT(check_in, "%d/%m/%Y") as checkin, DATE_FORMAT(check_out, "%d/%m/%Y") as checkout ' + 
                'FROM hotel.booking ' + 
                'where check_out >= CURDATE() and status = 0';
    mysql.conn.query(query, (err, result) => {
        //console.log(result);
        
        let data = result;
        res.render('admin/booking/booking_list', {data : data});
    })
}

// Render trang dat phong
function addBooking(req, res) {
    res.render('admin/booking/booking_add');
}

// Lay du lieu bang Ajax
function getData(req, res) {
    console.log(req.path);
    
    // danh sach khach san
    let method = req.params.method;
    if(method == 'getlisthotel') {
        mysql.conn.query('select * from hotel',(err,result) => {
            //console.log(result);
            return res.json(result);
        });
    }

    // Danh sach phong trong khach san
    if(method == 'getlistroom') {
        let idHotel = req.query.id;
        //console.log('idroom : ' , idHotel);
        
        mysql.conn.query('select * from room where hotel_id =' + idHotel, (err, result) => {
            //console.log(result);
            return res.json(result);
        });
    }

    // Danh sach casc ngay da dat cua phong
    if(method == 'getdatebooked') {
        let roomId = req.query.idRoom;
        model.getListBooked(roomId, (data) => { 
            return res.json(data);
        });
    };

    // Kiem tra ngay dat phong co hop le hay khong
    if(method == 'checkdate') {
        let roomid = req.query.roomid;
        let checkIn = req.query.checkin;
        let checkOut = req.query.checkout;
        //console.log('Room id' , roomid);
        model.checkDate(roomid, checkIn, checkOut, result => {
            return res.json(result);
        })
    }

    // Lay danh saach khach hang
    if(method == 'getlistcustomer') {
        mysql.conn.query('select * from customer', (err, datas) => {
            if(err) {
                console.log(err);
                return res.json([]);
            }
            return res.json(datas);
        })
    }
}
module.exports = router;
