'use strict'

var bcrypt=require('bcrypt-nodejs');
var User=require('../models/user');
var jwt=require('../services/jwt');

function register(req,res) {
    var user = new User();
    var params=req.body;

    if (params.username && params.email && params.password) {
        user.name=params.name;
        user.username=params.username;
        user.email=params.email;
        user.password=params.password;

        User.find({
            $or:[
                {email:user.email.toUpperCase()},
                {email:user.email.toLowerCase()},
                {password:user.password.toUpperCase()},
                {password:user.password.toLowerCase()}
            ]
        }).exec((err,users)=>{
            if(err) return res.status(500).send({message:'Request error'});

            if (users && user.length>=1) {
                return res.status(500).send({message:'User already exists'});
            } else {
                bcrypt.hash(params.password,null,null,(err,hash)=>{
                    user.password=hash;

                    user.save((err,userSaved)=>{
                        if(err) return res.status(500).send({message:'Error saving the user'});

                        if (userSaved) {
                            res.status(200).send({user:userSaved});
                        } else {
                            res.status(404).send({message:'Could not register user'});
                        }
                    })
                })
            }
        })
    } else {
        res.status(202).send({
            message:'Fill all the fields'
        })
    }
}

function login(req,res) {
    var params=req.body;
    var email=params.email;
    var password=params.password;

    User.findOne({email:email},(err,user)=>{
        if(err) return res.status(500).send({message:'Request error'});

        if (user) {
            bcrypt.compare(password, user.password,(err,check)=>{
                if (check) {
                    if (params.gettoken) {
                        return res.status(200).send({
                            token:jwt.createToken(user)
                        })
                    } else {
                        user.password=undefined;
                        return res.status(404).send({user})
                    }
                } else {
                    return res.status(404).send({message:'Could not identify user'})
                }
            })
        } else {
            return res.status(404).send({message:'Error user login'})
        }
    })
}

module.exports={
    register,
    login
}