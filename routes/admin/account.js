var express = require('express');
var router = express.Router();
var mysql = require('../../helpers/MySqlHelper')
var model = require('../../models/admin/account')
var bcrypt = require('../../helpers/BcryptHelpers');
var auth = require('../../helpers/Auth');
// Check dang nhap
router.use(auth.authAdmin);

router.get('/', getListAccount);
router.get('/add',  getAdd);
router.get('/edit', getEdit);
router.post('/add', postAdd);
router.post('/edit',postEdit);
router.post('/edituser', postEditUser);


// Lay danh sach Account
async function getListAccount (req, res) {
    let accountList = await mysql.queryAwait("select * from account");
    res.render('admin/account/account_list', { data : accountList});
}

function getAdd (req, res) {
    res.render('admin/account/account_add');
};

async function getEdit (req, res, next) {
    let id = req.query.id;
    let type = req.query.type;
    let data;
    try {
        if(type == 0) {
            data = await mysql.queryAwait('select id ,username, type from account where id = ?',[id]);
        } else if(type == 2) {
            data = await mysql.queryAwait('select account.id, account.username, account.type, customer.* from account inner join customer on account.id = customer.account_id where account.id = ?',[id]);
        }
    } catch (e) {}
    
    //console.log(data);
    if(!data) data = [];
    res.render('admin/account/account_edit', { data : data[0] });
};

async function postAdd (req, res, next) {
    //console.log(req.body);
    let data = req.body;
    console.log(data);
    
    if(data.type == '0') {
        // Them tai khoan admin
        try {
            data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
            let result = await mysql.queryAwait('insert into account (username, password, type) values (?,?,?)', 
                                                [data.username, data.password, data.type]);
            if(result.affectedRows > 0 ) {
                res.json({ok : true, message : 'Thêm tài khoản thành công'});
            } else return res.json({ ok : false , message : 'Có lỗi xảy ra , chưa thêm được' });
        } catch (e) {
            console.log(e);
            
            return res.json({ ok : false , message : 'Có lỗi xảy ra , chưa thêm được' })
        }
    } else if ( data.type == '2') {
        try {
            data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
            model.addUser(data, (ok) => {
                if(ok) return res.json({ok : true, message : 'Thêm tài khoản thành công'});
                else return res.json({ ok : false , message : 'Có lỗi xảy ra , chưa thêm được' });
            });
        } catch (e) {
            console.log(e);
            return res.json({ ok : false , message : 'Có lỗi xảy ra , chưa thêm được' })
        }
    } 
};

function postEditUser(req, res) {
    let data = req.body;
    let d = data.birthday.split('/');
    data.birthday = new Date(d[2], d[1], d[0])
    // Đổi thông tin người dùng 

    let data_update = [data.id, data.name, data.birthday, data.phone, data.email, data.address, data.gender];
    console.log('postEditUser : ', data_update);
    
    mysql.conn.query('call update_customer(?,?,?,?,?,?,?)', data_update, (err, done) => {

        done = JSON.stringify(done);
        console.log(done);
        done = JSON.parse(done);
        console.log(done);
        if (done.affectedRows > 0) return res.json(true);
        else return res.json(false);
    })

}

async function postEdit ( req, res) {
    let data = req.body;  
    let result;

    data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
    result = await mysql.queryAwait('update account set password = ? where id = ?', [data.password, data.id]);
    if (result.affectedRows > 0) return res.json({ ok: true, message: 'Cập nhật mật khẩu thành công thành công' })
    else return res.status(200).json({ ok: false, message: 'Có lỗi xảy ra , cập nhật thất bại   ' })
};

module.exports = router;