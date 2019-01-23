const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/booking', {useNewUrlParser: true});
var Token = mongoose.model('Token', { token : String , user : {} });


function findToken (token, cb) {
    Token.findOne({token : token}, (err, data) => {
        if(!err)
        cb(true, data);
        else cb(false, null);
    })
}

function saveToken(token, user) {
    let newtoken = new Token();
    newtoken.token = token;
    newtoken.user = user;
    console.log(newtoken);
    newtoken.save();
}
function removeToken(token, cb) {
    Token.remove({token : token}, (err) => {
        if(err) cb(false);
        else cb(true);
    })
}

module.exports = { findToken, saveToken, removeToken }