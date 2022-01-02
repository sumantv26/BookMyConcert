const Admin = require("../models/Admin");
const Users = require("../models/AllUsers");
const Customer = require("../models/Customer");
const Manager = require("../models/Manager");
const getModel = (role) => {
  if (role === "customer") return Customer;
  else if (role === "manager") return Manager;
  else if (role === "admin") return Admin;
  return null;
};
module.exports.getModel = getModel;
module.exports.identifyRole = async (req, res, next) => {
  if (req.query.user) {
    req.user.Model = getModel(req.query.user);
    next();
  }
//   const user = await Users.findOne({ email: req.user.email });
  req.user.Model = getModel(req.user.role);
  next();
};
