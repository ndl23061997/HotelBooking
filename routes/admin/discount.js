var express = require('express');
var router = express.Router();
var mysql = require('../../helpers/MySqlHelper')
var md5 = require('md5');
router.get('/list', listDiscount);
router.get('/add', addDiscount);
router.get('/listhotel', listHotel);
router.post('/add', postAdd);

async function postAdd(req,res) {
    let data = req.body;
    let c = 0;
    for(let i = 0; i < data.soluong ; i++) {
        let code = md5(data.name+(new Date()).toString() + i);
        let query = 'call add_discount(?,?,?,?,?)'
        let data_insert = [code,  data.hotel_id,data.name, data.type, data.percent/100,];
        try {
            let done = await mysql.queryAwait(query, data_insert);
            if(done.affectedRows == 1) c++;
        } catch (error) {
            let message = 'Đã thêm '+ c + ' mã giảm giá';
            console.log(message);
            res.json({ok: 1, message : message})
        }

    }
    let message = 'Đã thêm '+ c +' mã giảm giá';
    console.log(message);
    res.json({ok: 1, message : message})
}

function listHotel(req, res) {
    mysql.conn.query('select * from hotel',(err,result) => {
        //console.log(result);
        return res.json(result);
    });
}

function listDiscount(req, res) {
    mysql.conn.query('select * from discount', (err, done) => {
        let data = [];
        try{
            data = done;
        } catch (err) {}
        res.render('admin/discount/discount_list', {data : data})
    })
}


function addDiscount(req, res) {
    mysql.conn.query('select * from discount', (err, done) => {
        let data = [];
        try{
            data = done;
        } catch (err) {}
        res.render('admin/discount/discount_add', {data : data})
    })
}


module.exports = router;