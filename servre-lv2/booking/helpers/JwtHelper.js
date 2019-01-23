var jwt = require('jsonwebtoken'); 
let secret_key = 'long@nuce';
function syncToken(user) {
    let token =  jwt.sign(user, 'long@nuce', {});
    console.log("create token : ", token);
    return token;
}


function decode(token) {
    let result = jwt.verify(token, secret_key);
    return result;
}
module.exports.syncToken = syncToken;
module.exports.decode = decode;