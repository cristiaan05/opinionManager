'use strict'
var Survey=require('../models/survey');

function createSurvey(req,res) {
    var survey=new Survey();
    var params= req.body;

    if (params.idUser,params.description) {
        survey.idUser=params.idUser;
        survey.description=params.description;
        survey.opinions.yes=0;
        survey.opinions.no=0;
        survey.opinions.maybe=0;
        survey.responses='';
        Survey.find({
            $or:[
                {idUser:survey.idUser},
                {description:survey.description.toUpperCase()},
                {description:survey.description.toLowerCase()}
            ]
        }).exec((err,surveys)=>{
            if(err) return res.status(500).send({message:'Request Error'});
            if (surveys && survey.length>=1) {
                return res.status(500).send({message:'Survey already exists'});
            } else {
                survey.save((err,surveySaved)=>{
                    if(err) return res.status(500).send({message:'Error savind survey'});

                    if (surveySaved) {
                        res.status(200).send({survey:surveySaved});
                    } else {
                        res.status(404).send({message:'Could not save the survey'})
                    }
                })
            }
        })       
    } else {
        res.status(202).send({
            message:'Fill all the fields'
        })
    }

}


function updateSurvey(req,res) {
    var surveyId=req.params.id;
    var params=req.body;

    Survey.findById(surveyId,(err,surveyFounded)=>{
        if(err) return res.status(500).send({message:'Request error'});
        if(!surveyFounded) return res.status(404).send({message:'Could not found any  survey'});
        delete params.opinions;
        if (surveyFounded.idUser==req.user.sub) {
            Survey.findByIdAndUpdate(surveyId,params,{new:true},(err,surveyUpdated)=>{
                if(err) return res.status(500).send({message:'Request error'});
        
                if(!surveyUpdated) return res.status(404).send({message:'Could not updated the description of survey'});
        
                return res.status(200).send({survey:surveyUpdated});
            })
        } else {
            return res.status(202).send({message:'Dont have permission for update the survey'});
        }
    })
        
}

function deleteSurvey(req,res) {
    var surveyId=req.params.id;
    Survey.findById(surveyId,(err,surveyFounded)=>{
        if(err) return res.status(500).send({message:'Request error'});
        if(!surveyFounded) return res.status(404).send({message:'Could not found any  survey'});
        if (surveyFounded.idUser==req.user.sub) {
            Survey.findByIdAndRemove(surveyId,(err,surveyDeleted)=>{
                if(err) return res.status(500).send({message:'Request Error'});
                if(!surveyDeleted) return res.status(404).send({message:'Could not delted survey '});
                var message= "Survey Deleted: "+surveyDeleted.description;
                return res.status(202).send(message);
            })
        }else{
            return res.status(202).send({message:'Dont have permission for delete the survey'});
        }
    })    
    
}

function responseSurvey(req,res) {
    var asign='yes'
    var surveyId=req.params.id;
    var params=req.body;
    var opinion= params.opinion.toLowerCase();
    var user=req.user.sub;
    Survey.findById(surveyId,(err,surveyFounded)=>{
        if(err) return res.status(500).send({message:'Request error'});
        if(!surveyFounded) return res.status(404).send({message:'Could not found any  survey'});
        if(surveyFounded.responses){
            surveyFounded.responses.forEach(i => {
                if((i).toLowerCase() === (user).toLowerCase()){
                    asign='no'
                    return res.status(500).send({message:'User already responded this survey'})
                }
                else{
                    asign='yes'  
                }
            });
        }
        if (opinion=='yes' || opinion=='no' || opinion=='maybe') {
            if (opinion=='yes') {
                surveyFounded.opinions.yes=surveyFounded.opinions.yes +1
            }else if(opinion=='no'){
                surveyFounded.opinions.no=surveyFounded.opinions.no +1
            }else if(opinion=='maybe'){
                surveyFounded.opinions.maybe=surveyFounded.opinions.maybe+1
            }
            if (asign=='yes') {
                surveyFounded.responses.push(user)
                Survey.findByIdAndUpdate(surveyId,surveyFounded,{new:true},(err,surveyUpdated)=>{
                if(err) return res.status(500).send({message:'Request Error'});
                if(!surveyUpdated) return res.status(404).send({message:'Could not uptade opinion'});
                return res.status(200).send({Survey:surveyUpdated});
            })
            }
            
        } else {
            return res.status(202).send({message:'Invalid opinion, try with "yes","no","maybe"'});
        }
    })

}
    




module.exports={
    createSurvey,
    updateSurvey,
    deleteSurvey,
    responseSurvey
}