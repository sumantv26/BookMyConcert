const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");

const { Customer, validateCustomer } = require("../models/Customer");
const { Manager, validateManager } = require("../models/Manager");

const { Admin } = require("../models/Admin");

exports.signup = async (req, res, next) => {
  const data = req.body;
  const role = data.role;
  let Model;
  let validate;
  switch (role) {
    case "user":
      Model = Customer;
      validate = validateCustomer;
      if (await Manager.findOne({ email: data.email }))
        return res
          .status(400)
          .send("You are already registered with different role. ");
      break;
    case "concert manager":
      Model = Manager;
      validate = validateManager;
      if (await Customer.findOne({ email: data.email }))
        return res
          .status(400)
          .send("You are already registered with different role. ");
      break;
    case "admin":
      Model = Admin;
      validate = validateAdmin;
      break;
  }
  const { error } = validate(data);
  if (error) return res.status(400).send(error.message);

  let user = await Model.findOne({ email: req.body.email });
  if (user) return res.status(400).send("You are already registered");

  user = new Model(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res.status(200).send(token);
};

const generateAuthToken = (user, role) => {
  const obj = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: role,
  };
  return jwt.sign(obj, config.get("jwtKey"));
};

exports.login = async (req, res, next) => {
  let customer = await Customer.findOne({ email: req.body.email });
  if (
    customer &&
    (await bcrypt.compare(req.body.password, customer.password))
  ) {
    res.send(generateAuthToken(customer, "customer"));
    return;
  }
  let manager = await Manager.findOne({ email: req.body.email });
  if (manager && (await bcrypt.compare(req.body.password, manager.password))) {
    res.send(generateAuthToken(manager, "manager"));
    return;
  }
  let admin = await Admin.findOne({ email: req.body.email });

  if (admin && (await bcrypt.compare(req.body.password, admin.password))) {
    res.send(generateAuthToken(admin, "admin"));
    return;
  }

  return res.status(400).send("Invalid email/password");
};
