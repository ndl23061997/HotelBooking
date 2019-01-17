var express = require('express');
var router = express.Router();
var mysql = require('../../helpers/MySqlHelper')
var model = require('../../models/admin/account')
;
router.get('/', getListAccount);
router.get('/add',  getAdd);
router.get('/edit', getEdit);
router.post('/add', postAdd);
router.post('/edit',postEdit);
router.post('/delete', deleteAccount);

// Lay danh sach Account
async function getListAccount (req, res) {
    let accountList = await mysql.queryAwait("select * from account");
    res.render('admin/account_list', { data : accountList});
}

// Xoa Account
async function deleteAccount(req, res, next) {
    let result;
    if(req.body.type == 0) 
        result = await model.deleteAccount(req.body.id);
    else {
        await mysql.queryAwait('delete from customer where account_id = ?',[req.body.id]);
        result = await model.deleteAccount(req.body.id);
    }
    if(result) res.json({message : 'Xóa thành công'});
    else res.json({ error: 'Lỗi, xóa thất bại!' });
}

function getAdd (req, res) {
    res.render('admin/account_add');
};

async function getEdit (req, res, next) {
    let id = req.query.id;
    let type = req.query.type;
    let data;
    if(type == 0) {
        data = await mysql.queryAwait('select * from account where id = ?',[id]);
    } else if(type == 2) {
        data = await mysql.queryAwait('select * from account inner join customer on account.id = customer.account_id where account.id = ?',[id]);
    }
    console.log(data);
    return res.render('admin/account_edit', { data : data[0] });
};

async function postAdd (req, res, next) {
    //console.log(req.body);
    let data = req.body;
    console.log(data);
    
    if(data.type == '0') {
        // Them tai khoan admin
        try {
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
        model.addUser(data, (ok) => {
            if(ok) return res.json({ok : true, message : 'Thêm tài khoản thành công'});
        else return res.json({ ok : false , message : 'Có lỗi xảy ra , chưa thêm được' });
        });
    } 
};

async function postEdit ( req, res) {
    let data = req.body;  
    if(data.type == 0) {
        let result;
        try {
            result = await mysql.queryAwait('update account set password = ? where id = ?', [data.password, data.id]);
            if(result.affectedRows > 0) return res.json({ok: true, message : 'Cập nhật mật khẩu thành công thành công'}) 
            else  return res.status(200).json({ ok : false , message : 'Có lỗi xảy ra , cập nhật thất bại   ' })
        }
        catch (e) {
            return res.json({ ok : false , message : 'Có lỗi xảy ra , cập nhật thất bại   ' })
        }    
    }
         
};

module.exports = router;