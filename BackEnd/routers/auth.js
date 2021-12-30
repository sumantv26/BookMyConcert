const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const {User,validateUser} = require('../models/User');
const {Manager,validateManager} = require('../models/Manager');
const validateLogin = require('../middleware/validateLogin');
const { Admin } = require('../models/Admin');


const router=express.Router();

router.post('/',validateLogin,async(req,res)=>{
    let user=await User.findOne({email:req.body.email})
    if(user && user.password===req.body.password ){
        res.send(generateAuthToken(user,"user"))
        return;
    }
    let manager=await Manager.findOne({email:req.body.email})
    if(manager && manager.password===req.body.password){
        res.send(generateAuthToken(manager,"manager"))
        return;
    }
    let admin=await Admin.findOne({email:req.body.email})

    if(admin && admin.password===req.body.password){
        res.send(generateAuthToken(admin,"admin"))
        return;
    }
   
    return res.status(400).send("Invalid email/password");
    
})

function generateAuthToken(user,role){
    const obj={
        _id:user._id,
        name:user.name,
        email:user.email,
        role:role
    }
    return jwt.sign(obj,config.get("jwtKey"))
}


module.exports=router;