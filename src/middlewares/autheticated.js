'use strict'

var jwt= require('jwt-simple');
var moment=require('moment');
var secret='secret_pass';

exports.ensureAuth=function (req,res,next) {
    if (!req.headers.authorization) {
        return res.status(403).send({message:'Request dont have the authorization header'});
    }

    var token=req.headers.authorization.replace(/['"]+/g,'');
    var payload=null;
    
    try {
        payload=jwt.decode(token,secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message:'Token has been expired'
            })
        }
    } catch (ex) {
        return res.status(404).send({
            message:'Invalid token'
        })
    }

    req.user=payload;
    next();
}