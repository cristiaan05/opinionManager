'use strict'
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var SurveySchema=Schema({
    idUser:String,
    description:String,
    opinions:{yes:Number,no:Number,maybe:Number},
    responses:[String]
})

module.exports=mongoose.model('Survey',SurveySchema);