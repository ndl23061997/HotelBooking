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

function changeUploadFolder(folder) {
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/' + folder)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname.split(' ').join('_').toLocaleLowerCase()) //Appending .jpg
        }
    })
}

var upload = multer({ storage: storage });
const ex = {
    fs : fs,
    upload : upload,
    changeFolder : changeUploadFolder
}
module.exports = ex;