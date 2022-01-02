const Manager = require("../models/Manager")

module.exports.getApprovedMangers= async(req,res, next)=>{
    const managers=await Manager.find({isApproved:true}).select("-password");
    
}