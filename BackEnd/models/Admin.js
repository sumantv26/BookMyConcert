const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const { common } = require("./Common");
const { Schema, model } = mongoose;
const schema = new Schema({
  ...common,
});

schema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, name: this.name, email: this.email, role: "admin" },
    config.get("jwtKey")
  );
};

const Admin = model("Admin", schema);

// function validateAdmin(admin) {
//   const schema = Joi.object({
//     name: Joi.string().min(3).max(225).required(),
//     email: Joi.string().email().min(3).max(225).required(),
//     password: Joi.string().min(5).max(1024),
//   });
//   return schema.validate(admin);
// }
exports.Admin = Admin;
// exports.validateAdmin = validateAdmin;
