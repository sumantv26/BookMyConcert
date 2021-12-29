const express = require('express');
const Joi = require('joi');
const {User,validateUser} = require('../models/User');
const {Manager,validateManager} = require('../models/Manager');

const router=express.Router();

router.post('/',async(req,res)=>{
    const {error}=validateEmailPassword(req.body)
    if(error)return res.status(400).send(error.message);
    let user=await User.findOne({email:req.body.email})
    if(user && user.password===req.body.password ){
        res.send(user.generateAuthToken())
        return;
    }
    let manager=await Manager.findOne({email:req.body.email})
    if(manager && manager.password===req.body.password){
        res.send(manager.generateAuthToken())
        return;
    }
    return res.status(400).send("Invalid email/password");
    
})

function validateEmailPassword(user){
    const schema = Joi.object({
        email: Joi.string().email().min(3).max(50).required(),
        password: Joi.string().min(5).max(50),
    })
    return schema.validate(user)
}

module.exports=router;