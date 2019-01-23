var express = require('express');
var router = express.Router();
var model = require('../../models/admin/room/hotel');

router.get('/list', (req, res) => {
    model.getAllHotel((ok, datas) =>{ 
        if(ok) {
            datas.forEach(element => {
                element.image = JSON.parse(element.images)
            });
            res.send(datas);
        } else {
            res.send([])
        }
    })
});

module.exports = router;