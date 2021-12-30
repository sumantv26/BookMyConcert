const express = require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const { validateUser, User } = require('../models/User');
router.post("/",async(req,res)=>{
    const {error}=validateUser(req.body)
    if(error)return res.status(400).send(error.message)
    let user=await User.findOne({email:req.body.email})
    if(user) return res.status(400).send("User already Registerd")

     user=new User(req.body);
    const salt= await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password,salt)
    await user.save()
    const token=user.generateAuthToken();
    res.status(200).send(token);
})

module.exports=router;
