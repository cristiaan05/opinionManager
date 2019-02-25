'use strict'

var express=require('express');
var UserController=require('../controllers/userController');
var md_auth=require('../middlewares/autheticated');

var api= express.Router();

//ROUTES
api.post('/register',UserController.register);
api.post('/login',UserController.login);

module.exports=api;