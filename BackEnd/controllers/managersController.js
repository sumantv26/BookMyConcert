const Manager = require("../models/Manager");

module.exports.getApprovedMangers = async (req, res, next) => {
  const managers = await Manager.find({ isApproved: true }).select("-password");
};
// i am changing this
// hello sumant how are you?
//changes 2.0