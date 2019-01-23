var express = require('express');
var router = express.Router();
var newModel = require('../../../models/admin/news/news')

router.get('/:id', (req, res) => {
    let id = req.params.id;
    console.log('router : new - delete line 7 :', id);
    if (!id) {
        next(createError(404, 'Không tìm thấy tin tức này'))
    }
    newModel.deleteNew(id, (result) => {
        if (result) {
            req.flash('message1', 'Xóa thành công');
        } else {
            req.flash('message2', 'Có lỗi xảy ra, vui lòng thử lại');
        }
        res.redirect('/admin/news/list');
    })
})

module.exports = router;