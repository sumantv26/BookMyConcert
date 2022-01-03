const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const Common = require("./Common");
// const { Schema, model } = mongoose;
const schema = new mongoose.Schema({
  ...Common,
});

schema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, name: this.name, email: this.email, role: "customer" },
    config.get("jwtKey")
  );
};

const Customer = mongoose.model("Customer", schema);

// function validateCustomer(customer) {
//   const now = Date.now();
//   // 18 years ago date
//   const cutOffDate = new Date(now - 1000 * 60 * 60 * 24 * 365 * 18);

//   const schema = Joi.object({
//     name: Joi.string().min(3).max(255).required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().min(3).max(15).required(),
//     password_confirmation: Joi.any()
//       .valid(Joi.ref("password"))
//       .required()
//       .options({ language: { any: { allowOnly: "must match password" } } }),
//     birthDate: Joi.date().max(cutOffDate).required(),
//     gender: Joi.string().valid("male", "female", "other"),
//     role: Joi.string().valid("user").required(),
//   });
//   return schema.validate(customer);
// }

module.exports = Customer;
// exports.validateCustomer = validateCustomer;
