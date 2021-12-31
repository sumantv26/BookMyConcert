// const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Common = require("./Common");
// const { Schema, model } = mongoose;
const schema = new mongoose.Schema({
  ...Common,
  contactNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  creditCardNum: {
    type: Number,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
});

schema.pre("save", async function (next) {
  // if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

schema.methods.correctPassword = async function (provided, actual) {
  return await bcrypt.compare(provided, actual);
};

schema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, name: this.name, email: this.email, role: "manager" },
    config.get("jwtKey")
  );
};

const Manager = mongoose.model("Manager", schema);

// function validateManager(user) {
//   const schema = Joi.object({
//     // name: Joi.string().min(3).max(225).required(),
//     // email: Joi.string().email().min(3).max(225).required(),
//     // password: Joi.string().min(5).max(1024),
//     contactNumber: Joi.string()
//       .length(10)
//       .pattern(/^[0-9]+$/)
//           .required(),
//       creditCardNum: Joi.number().length(16).required(),
//     isApproved: Joi.boolean().default(false),
//   });
//   return schema.validate(user);
// }
module.exports = Manager;
// exports.validateManager = validateManager;
