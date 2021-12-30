const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");

const { Customer, validateCustomer } = require("../models/Customer");
const { Manager, validateManager } = require("../models/Manager");
const validateLogin = require("../middleware/validateLogin");
const { Admin } = require("../models/Admin");

const router = express.Router();

router.post("/", validateLogin, async (req, res) => {
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
});

function generateAuthToken(user, role) {
  const obj = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: role,
  };
  return jwt.sign(obj, config.get("jwtKey"));
}

module.exports = router;
