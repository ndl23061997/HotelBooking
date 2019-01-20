var express = require('express');
var router = express.Router();
const mysql = require('../../helpers/MySqlHelper');
const model = require('../../models/admin/room_use');
const modelBooking = require('../../models/admin/booking')
router.get('/', getRoomUse);
router.get('/detail/:id', getDetailRoomUse);
router.get('/get-ls-service/:id', getLsService);
router.get('/get-ls-service-type', getServiceType);
router.get('/get-service/:id', getServiceDetail);
router.post('/order', postOrder);
router.post('/add-discount', addDiscount);


function addDiscount(req, res) {
    let data = req.body;
    console.log(data);
    
    mysql.conn.query('call add_discount_to_bill(?,?)', [data.code, data.idbill], (err, done) => {
        if(err) {
            console.log('#addDiscount \n',err);
            res.json({ok : false, message: 'Đã có lỗi xảy ra, vui lòng kiểm tra lại'})
            return;
        }
        console.log('#addDiscount \n' , done);
        res.json({ok : done[0][0].ok, message: done[0][0].message });
    })
}

function getRoomUse(req, res) {
    model.getListRoomUse((data) => {
        res.render('admin/room_use/room_use_list', {data: data})
    })
}

async function getDetailRoomUse(req, res) {
    let id = req.params.id;
    let query = "select * from bill where booking_id = ?";
    let bill = await mysql.queryAwait(query, [id]);
    modelBooking.getDetailBooking(id, (result) => {
        let data = result[0];
        console.log('Bill \n', bill);
        res.render('admin/room_use/room_use_detail', {data : data, bill : bill[0]});
    })
}

function getLsService (req, res) {
    let id = req.params.id;
    let query = "select * from service where type_id = ? and status <> 0";
    mysql.conn.query(query, [id],(err, done) => {
        console.log('#getSevice \n', done);
        res.json(done)
    })
}


function getServiceType(req, res) {
    let query = "select * from servicetype";
    mysql.conn.query(query,(err, done) => {
        console.log('#getServiceType \n', done);
        res.json(done)
    })
}

function getServiceDetail(req, res) {
    let id = req.params.id;
    let query = "select * from service where id = ?";
    mysql.conn.query(query,[id],(err, done) => {
        console.log('#getServiceById \n', done);
        res.json(done[0])
    })
}


function postOrder(req, res) {
    let data = req.body;
    let query = "call add_order(?,?,?)"
    console.log(data);
    
    mysql.conn.query(query, [data.idService, data.idBill, data.count], (err, done) => {
        console.log(err);
        
        console.log("Order \n", done);
        if(done[0][0].ok == 1) res.json({ok : true, message : 'Order thành công'})
        else res.json({ok: false, message : 'Có lỗi xảy ra'});
    })
}
module.exports = router;