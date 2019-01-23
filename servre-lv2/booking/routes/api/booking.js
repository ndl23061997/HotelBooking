var express = require('express');
var router = express.Router();
var model = require('../../models/admin/booking/booking');
const TAG = 'Nguyen Long - /router/admin/booking/booking.js \n';
var auth = require('../auth');
const JwtHelper = require('../../helpers/JwtHelper')
const mysqlHelper = require('../../helpers/MySqlHelper');
const nodemailer = require('nodemailer')
const db = require('../../models/database')
// config mail server
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "ndl0697@gmail.com",
        pass: "long23061997"
    }
});

function sendMail(res, req, data) {

// Data 
    let query = "select * from Customer inner join Account "+
    "on Customer.account_id = Account.id "  + 
    "where Customer.id = " + data.customer_id;
    console.log(query);
    
    db.query(query, (err, result) => {
        let html = "Bạn đã đặt phòng thành công, thông tin đặt phòng : + \n"+
        "Mã đặt phòng : " + data.id +
        "Mã phòng : " + data.room_id +
        "Ngày nhận phòng : " + data.check_in +
        "Ngày trả phòng : " + data.check_out + 
        "Người đặt phòng : " + result[0].name; 
        console.log(result);
        let to = result[0].email;
        let content = "Đặt phòng thành công";
        const mailOptions = { to, content , html };

        console.log(mailOptions);
        
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
    })
    

    // // Data 


    // const mailOptions = { email, content , html };

    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
}

// Lay danh sach cac phong da dat
router.get('/date-disable/:id_room', phongDaDat);

router.post('/book', doBooking);

function doBooking (req, res) {
    let booking = {
        idroom : req.body.room_id,
        idcustomer : req.session.userInfo.id,
        checkin :req.body.check_in,
        checkout : req.body.check_out,
        currency : 'VND'
    }

    console.log(booking);
    
    model.addBooking(booking, (ok, data)=> {
        if(ok) {
            console.log("Dat phong thanh cong");
            sendMail(req, res, data[0]);
            return res.json({"booked" : "success"})
        } else {
            console.log("Dat phong that bai");
            return res.json({booked : "fail", message : "Đặt phòng thất bại"});
        }
    })
}

function phongDaDat(req, res) {
    let id_room = req.params.id_room;
console.log(id_room);
    if (id_room) {
        model.getBookingByRoom(id_room, (ok, datas) => {
            if (ok) {
                let listDate = [];
                datas.forEach(elment => {
                    console.log("vt 1" + JSON.stringify(elment));
                    let check_in = new Date(elment.check_in);
                    let check_out = new Date(elment.check_out);
                    while (check_in < check_out) {
                        console.log(check_in.getDate());
                        listDate.push(check_in.toLocaleString());
                        check_in.setDate(check_in.getDate() + 1);
                    }
                });
                console.log(TAG, listDate);
                res.json(listDate);
            }
        })

    } else {
        res.json([])
    }
}

module.exports = router;