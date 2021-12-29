const Joi = require("joi");
const mongoose = require("mongoose");
const config = require('config');
const jwt = require("jsonwebtoken");
const { Schema,model } = mongoose;
const schema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024,
  },

  role: {
    type: String,
    required: true,
  },
});

schema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, name: this.name, role:this.role}, config.get('jwtKey'))
}

const Manager=model("Manager",schema)

function validateManager(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(225).required(),
        email: Joi.string().email().min(3).max(225).required(),
        password: Joi.string().min(5).max(1024),
        role:Joi.string().required()
    })
    return schema.validate(user)

}
exports.Manager = Manager;
exports.validateManager= validateManager