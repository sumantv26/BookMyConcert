const Admin = require("../models/UserModels/Admin");
const Customer = require("../models/UserModels/Customer");
const Manager = require("../models/UserModels/Manager");

const getModel = (role) => {
  if (role === "customer") return Customer;
  else if (role === "manager") return Manager;
  else if (role === "admin") return Admin;
  return null;
};

module.exports = getModel;
