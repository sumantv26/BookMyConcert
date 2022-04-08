const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const Common = require("./Common");

const schema = new mongoose.Schema({
  ...Common,
});

// schema.methods.generateAuthToken = function () {
//   return jwt.sign(
//     { _id: this._id, name: this.name, email: this.email, role: "admin" },
//     config.get("jwtKey")
//   );
// };

const Admin = mongoose.model("Admin", schema);

// function validateAdmin(admin) {
//   const schema = Joi.object({
//     name: Joi.string().min(3).max(225).required(),
//     email: Joi.string().email().min(3).max(225).required(),
//     password: Joi.string().min(5).max(1024),
//   });
//   return schema.validate(admin);
// }
module.exports = Admin;
// exports.validateAdmin = validateAdmin;
