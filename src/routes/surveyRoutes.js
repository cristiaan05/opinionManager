'use strict'

var express=require('express');
var SurveyController=require('../controllers/surveyController');
var md_auth=require('../middlewares/autheticated');

var api= express.Router();

api.post('/createSurvey',md_auth.ensureAuth,SurveyController.createSurvey);
api.put('/updateSurvey/:id',md_auth.ensureAuth,SurveyController.updateSurvey);
api.delete('/deleteSurvey/:id',md_auth.ensureAuth,SurveyController.deleteSurvey);
api.put('/responseSurvey/:id',md_auth.ensureAuth,SurveyController.responseSurvey);

module.exports=api;