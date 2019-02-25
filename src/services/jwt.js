'use strict'

var jwt=require('jwt-simple');
var moment=require('moment');
var secret= 'secret_pass';

exports.createToken=function (user) {
    var payload={
        sub:user._id,
        name:user.name,
        username:user.name,
        email:user.email,
        iat:moment().unix(),
        exp:moment().day(30,'days').unix
    }
    return jwt.encode(payload,secret);
}