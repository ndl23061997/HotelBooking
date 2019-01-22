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
router.post('/paybill', payBill);
router.post('/traphong', traPhong);

function traPhong(req, res) {
    let id = req.body.id; // Booking id
    mysql.conn.query('select status from bill where booking_id = ?', [id], (err, done)=> {
        if(done.length < 0) return res.json({ok: false, message:'Vui lòng kiểm tra lại hóa đơn'});
        if(done[0].status == 0) return res.json({ok : 0, message : 'Vui lòng thanh toán hóa đơn trước'});
        else {
            let query = 'update booking set status = 2 where id = ?';
            mysql.conn.query(query, [id], (err, done) => {
                if(err) {
                    console.log(err);
                    res.json({ok : 0});
                } //#endregion
                console.log(done);
                
                if(done.affectedRows > 0) {
                    res.json({ok : 1});
                } else res.json({ok : 0, message:'Có lỗi xảy ra'})
                return;
            })
        }
    })
}

function payBill(req, res) {
    let id = req.body.id;
    let query = 'update bill set da_tt = tt where id = ?';
    mysql.conn.query(query, [id], (err, done) => {
        if(err) {
            console.log(err);
            res.json({ok : 0});
        } //#endregion

        if(done.affectedRows > 0) {
            res.json({ok : true});
        } else res.json({ok : false})
        return;
    })
}

function addDiscount(req, res) {
    let data = req.body;
    console.log('addDiscount abc',data);
    
    mysql.conn.query('call add_discount_to_bill(?,?)', [data.code, data.idbill], (err, done) => {
        if(err) {
            console.log('#addDiscount \n',err);
            res.json({ok : false, message: 'Đã có lỗi xảy ra, vui lòng kiểm tra lại'})
            return;
        }
        console.log('#addDiscount \n' , done);
        let rs = {ok : done[0][0].ok, message: done[0][0].message };
        console.log(rs);
        return res.json(rs);
    })
}

function getRoomUse(req, res) {
    model.getListRoomUse((data) => {
        res.render('admin/room_use/room_use_list', {data: data})
    })
}

async function getDetailRoomUse(req, res, next) {
    let id = req.params.id;
    let query = "select * from bill where booking_id = ?";
    let bill = await mysql.queryAwait(query, [id]);
    console.log(bill);
    modelBooking.getDetailRoomUse(id, (result) => {
        if(result.length == 0) return next(new Error(404, 'Không có phòng này đang sử dụng'));
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