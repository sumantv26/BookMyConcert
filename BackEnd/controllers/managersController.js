const Users = require("../models/AllUsers");
const Manager = require("../models/Manager");

module.exports.getApprovedOrNonMangers = async (req, res, next) => { 
if(req.body.isApproved===undefined)return res.status(400).send("no argument specified. isapproved is undefined.") 
  const managers = await Manager.find({ isApproved:req.body.isApproved }).select("-password");
  res.send(managers)
};
module.exports.approveManger = async (req, res, next) => {  
if(req.body.isApproved===undefined)return res.status(400).send("no argument specified. isapproved is undefined.") 
  const managers = await Manager.findOne({_id:req.params.id});
  managers.isApproved=req.body.isApproved;
  await managers.save()
  res.status(200).send(req.body.isApproved?"Approved successful.":"Not Approved successful")
};
