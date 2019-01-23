var express = require('express');
var router = express.Router();
var roomModel = require('../../../models/admin/room/room');
var hotelModel = require('../../../models/admin/room/hotel');
var roomtypeModals = require('../../../models/admin/room/roomtype');
var multer = require('multer')

var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname.split(' ').join('_').toLocaleLowerCase()) //Appending .jpg
    }
})

var upload = multer({ storage: storage });
//****************Danh sách dữ liệu****************
router.get('/room-list', (req, res) => {
    data = {
        title: 'Quản lí phòng',
        check: 'nav-room',
        page: 'room'
    };
    data['message1'] = req.flash('message1');
    data['message2'] = req.flash('message2');
    roomModel.getAllRoom((result, datas) => {
        data['datas'] = datas;
        res.render('admin/room/index', data);
    })

});

// ****************Xóa bản ghi****************
router.get('/delete-room/:id', (req, res) => {
    let id = req.params.id;
    roomModel.deleteRoom(id, (result) => {
        if (result) {
            req.flash('message1', 'Xóa thông tin phòng thành công!');
        } else {
            req.flash('message2', 'Có lỗi xảy ra, vui lòng thử lại!');
        }
        res.redirect('../room-list');
    });
});



// ***********Chỉnh sửa và update dữ liệu****************
router.get('/edit-room/:id', (req, res) => {
    let data = {
        title: 'Sửa thông tin phòng',
        check: 'nav-room',
        message1: req.flash('message1'),
        message2: req.flash('message2')
    }
    let id = req.params.id;
    roomModel.getDetail(id, (result) => {
        result.detail[0].image = JSON.parse(result.detail[0].images);
        
        data['data'] = result;
        res.render('admin/room/edit-room', data);
    });

});

router.post('/room-delete-image', (req, res) => {

    roomModel.getRoomByID(req.body.id, (result, data) => {
        fs.unlink('uploads' + req.body.image, (err) => {

            let newdata = data;
            newdata.image = JSON.parse(newdata.images);
            newdata.image.splice(newdata.image.indexOf(req.body.image), 1);
            newdata.image = JSON.stringify(newdata.image);

            roomModel.updateRoom(req.body.id, newdata, (result) => {
                if (result) {
                    res.status(200);
                    res.send('Xóa ảnh thành công')
                } else {
                    res.status(200);
                    res.send('Có lỗi xảy ra');
                }
            })
        })

    })
});

// Sua thong tin

router.post('/edit-room/:id', upload.array('images', 10), (req, res, next) => {
    let data = {
        title: 'Sửa thông tin phòng',
        check: 'nav-room'
    }
    if (req.files) {
        let filePath = req.files.map(file => file.path.substring(7));
        let id = req.params.id;

        roomModel.getRoomByID(id, (result, data2) => {
            if (result) {
                let newdata = data2;
                newdata.image = JSON.parse(newdata.images);
                filePath.forEach(element => {
                    newdata.image.push(element);
                });
                newdata.image = JSON.stringify(newdata.image);
                newdata.hotel_id = req.body.hotel_id;
                newdata.type_id = req.body.type_id;
                newdata.des = req.body.des;
                newdata.price = req.body.price;
                newdata.maso = req.body.maso;

                roomModel.updateRoom(id, newdata, (result) => {
                    if (result) {
                        req.flash('message1', 'Lưu thông tin thành công!')
                        res.redirect(id);
                    } else {
                        req.flash('message2', 'Có lỗi xảy ra thông tin chưa được lưu lại!')
                        res.redirect(id);
                    }
                })
            } else {
                req.flash('message2', 'Có lỗi xảy ra thông tin chưa được lưu lại!')
                res.redirect(id);
            }

        });

    } else {
        req.flash('Có lỗi xảy ra');
        res.render('admin/room/edit-room');
    }
});

router.get('/add-room', (req, res) => {
    let datarender = {
        title: 'Thêm phòng',
        check: 'nav-room',
        message1: req.flash('message1'),
        message2: req.flash('message2')
    }

    roomModel.getTemplate((result, data) => {
        if (result) {
            datarender['data'] = data;
            res.render('admin/room/add-room', datarender);
        } else {
            req.flash('message2', 'Có lỗi xảy ra, không thể  truy cập!');
            res.redirect('/admin/room/room-list');
        }

    });

});

router.post('/add-room', upload.array('images', 10), (req, res, next) => {
    if (req.files) {
        let filePath = req.files.map(file => file.path.substring(7));
        let data = {};
        data.image = JSON.stringify(filePath);
        data.hotel_id = req.body.hotel_id;
        data.type_id = req.body.type_id;
        data.des = req.body.des;
        data.price = req.body.price;
        data.maso = req.body.maso;

        roomModel.addRoom(data, (result) => {
            if (result) {
                req.flash('message1', 'Thành công!')
                res.redirect('/admin/room/room-list');
            } else {
                req.flash('message2', 'Có lỗi xảy ra , vui lòng thử  lại!')
                res.redirect('/admin/room/room-list');
            }
        })
    } else {
        req.flash('message2','Có lỗi xảy ra, vui lòng thử lại');
        res.redirect('/admin/room/room-list');
    }
});


router.get('/hotel-list', (req, res) => {
    data = {
        title: 'Quản lí phòng',
        check: 'nav-room',
        page: 'hotel'
    };
    data['message1'] = req.flash('message1');
    data['message2'] = req.flash('message2');
    hotelModel.getAllHotel((result, datas) => {
        data['datas'] = datas;
        res.render('admin/room/index', data);
    })
})

router.get('/delete-hotel/:id', (req, res) => {
    let id = req.params.id;
    hotelModel.deleteHotel(id, (result) => {
        if (result) {
            req.flash('message1', 'Xóa thông tin khách sạn thành công!');
        } else {
            req.flash('message2', 'Có lỗi xảy ra, vui lòng thử lại!\n Có thể  đã đăng kí phòng trong khách sạn này');
        }
        res.redirect('../hotel-list');
    });
});

router.get('/edit-hotel/:id', (req, res) => {
    let id = req.params.id;
    let datarender = {
        title: 'Sửa thông tin khách sạn',
        check: 'nav-room',
        message1: req.flash('message1'),
        message2: req.flash('message2')
    }
    hotelModel.getHotelByID(id, (result, data) => {
        data.image = JSON.parse(data.images);
        datarender['data'] = data;
        (datarender.data);
        res.render('admin/room/edit-hotel', datarender);
    });
});

router.post('/hotel-delete-image', (req, res) => {
    //(req.body);
    hotelModel.getHotelByID(req.body.id, (result, data) => {
        fs.unlink('uploads' + req.body.image, (err) => {
            //if (err) throw Error('Lỗi khi xóa file trên server');
            let newdata = data;
            // (newdata);
            newdata.image = JSON.parse(newdata.images);
            newdata.image.splice(newdata.image.indexOf(req.body.image), 1);
            newdata.image = JSON.stringify(newdata.image);
            // (newdata);
            hotelModel.updateHotel(req.body.id, newdata, (result) => {
                if (result) {
                    res.send(200, 'Xóa ảnh thành công')
                } else {
                    res.send(200, 'Có lỗi xảy ra');
                }
            })
        })

    })
});

router.post('/edit-hotel/:id', upload.array('images', 3), (req, res, next) => {
    if (req.files) {
        let filePath = req.files.map(file => file.path.substring(7));
        let id = req.params.id;
        (id);

        hotelModel.getHotelByID(id, (result, data2) => {
            if (result) {
                let newdata = data2;
                // (newdata);
                newdata.image = JSON.parse(newdata.images);
                filePath.forEach(element => {
                    newdata.image.push(element);
                });
                newdata.image = JSON.stringify(newdata.image);
                newdata.name = req.body.name;
                newdata.des = req.body.des;
                newdata.location = req.body.location;
                newdata.maso = req.body.maso;

                hotelModel.updateHotel(id, newdata, (result) => {
                    if (result) {
                        req.flash('message1', 'Lưu thông tin thành công!')
                        res.redirect(id);
                    } else {
                        req.flash('message2', 'Có lỗi xảy ra thông tin chưa được lưu lại!')
                        res.redirect(id);
                    }
                })
            } else {
                req.flash('message2', 'Có lỗi xảy ra thông tin chưa được lưu lại!')
                res.redirect(id);
            }

        });

        //next();
    } else {
        req.flash('Có lỗi xảy ra');
        res.render(req.params.id);
    }
});

router.get('/add-hotel', (req, res) => {
    let datarender = {
        title: 'Thêm khách sạn',
        check: 'nav-room',
        message1: req.flash('message1'),
        message2: req.flash('message2')
    }
    res.render('admin/room/add-hotel', datarender);
});


router.post('/add-hotel', upload.array('images', 3), (req, res, next) => {
    if (req.files) {
        let filePath = req.files.map(file => file.path.substring(7));
        let data = {};
        data.image = JSON.stringify(filePath);
        data.maso = req.body.maso;
        data.name = req.body.name;
        data.des = req.body.des;
        data.location = req.body.location;
        data.maso = req.body.maso;

        (data);

        hotelModel.addHotel(data, (result) => {
            if (result) {
                req.flash('message1', 'Thành công!')
                res.redirect('/admin/room/hotel-list');
            } else {
                req.flash('message2', 'Có lỗi xảy ra , vui lòng thử  lại!')
                res.redirect('/admin/room/hotel-list');
            }
        })
    } else {
        req.flash('Có lỗi xảy ra, vui lòng thử lại');
        res.render(req.params.id);
    }
});
// Them ban ghi

// Loai phong
router.get('/roomtype-list', (req, res) => {
    data_render = {
        title: 'Quản lí loại phòng',
        check: 'nav-room',
        page: 'roomtype'
    };
    data_render['message1'] = req.flash('message1');
    data_render['message2'] = req.flash('message2');
    roomtypeModals.getAllRoomType((result, datas) => {
        console.log('Ket qua la : \n', result,'\n', datas);
        data_render['datas'] = datas;
        res.render('admin/room/index', data_render);
    })
});



router.get('/delete-roomtype/:id', (req, res) => {
    let id = req.params.id;
    roomtypeModals.deleteRoomType(id, (result) => {
        if (result) {
            req.flash('message1', 'Xóa thông tin phòng thành công!');
        } else {
            req.flash('message2', 'Có lỗi xảy ra, vui lòng thử lại!\n Có thể  đã đăng kí phòng trong loại này');
        }
        res.redirect('../roomtype-list');
    });
});

router.get('/edit-roomtype/:id', (req, res) => {
    let id = req.params.id;
    let datarender = {
        title: 'Sửa thông tin loại phòng',
        check: 'nav-room',
        message1: req.flash('message1'),
        message2: req.flash('message2')
    }
    roomtypeModals.getRoomTypeByID(id, (result, data) => {
        if (result) {
            datarender['data'] = data;
            res.render('admin/room/edit-roomtype', datarender);
        } else {
            res.send(404, 'Không tìm thấy loại phòng')
        }

    });
});

router.post('/edit-roomtype/:id', (req, res, next) => {

    let id = req.params.id;
    let newData = {};
    newData['des'] = req.body.des;
    newData.name = req.body.name;
    console.log(newData);
    roomtypeModals.updateRoomType(id,newData, (result) => {
        if (result) {
            req.flash('message1', 'Lưu thông tin thành công!')
            res.redirect(id);
        } else {
            req.flash('message2', 'Có lỗi xảy ra thông tin chưa được lưu lại!')
            res.redirect(id);
        }
    })
});

router.get('/add-roomtype', (req, res)=> {
    let datarender = {
        title: 'Thêm loại phòng',
        check: 'nav-room',
        message1: req.flash('message1'),
        message2: req.flash('message2')
    }
    res.render('admin/room/add-roomtype', datarender);
})
module.exports = router;