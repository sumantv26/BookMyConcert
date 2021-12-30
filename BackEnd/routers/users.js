const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { validateCustomer, Customer } = require("../models/Customer");
const { validateManager, Manager } = require("../models/Manager");
const { validateAdmin, Admin } = require("../models/Admin");

router.post("/", async (req, res) => {
  const { role, ...data } = req.body;
  if (!role) return res.status(400).send("No role is defiend");
  let Model;
  let validate;
  switch (role) {
    case "customer":
      Model = Customer;
      validate = validateCustomer;
      if (await Manager.findOne({ email: data.email }))
        return res
          .status(400)
          .send("You are already register with different role. ");
      break;
    case "manager":
      Model = Manager;
      validate = validateManager;
      if (await Customer.findOne({ email: data.email }))
        return res
          .status(400)
          .send("You are already register with different role. ");
      break;
    case "admin":
      Model = Admin;
      validate = validateAdmin;
      break;
  }

  const { error } = validate(data);
  if (error) return res.status(400).send(error.message);
  let user = await Model.findOne({ email: req.body.email });
  if (user) return res.status(400).send("You have already Registerd");
  user = new Model(req.body);
  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res.status(200).send(token);
});

module.exports = router;
