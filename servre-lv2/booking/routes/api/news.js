var express = require('express');
var router = express.Router();
var newModel = require('../../models/admin/news/news')

router.get('/list', (req, res) => {
    newModel.getListNew((result, data)=> {
        if(result) {
            data.forEach(element => {
                element.image = JSON.parse(element.image)
            });
            console.log(data);
            res.send(data);
        }
    })
});

router.get('/list/:from', (req, res) => {
    let from = req.params.from;
    newModel.getListFrom(from, (ok, datas) => {
        if(ok) {
            datas.forEach(element => {
                element.image = JSON.parse(element.images)
            });
            console.log(datas);
            
            res.send(datas);
        }
    });
});




module.exports = router;