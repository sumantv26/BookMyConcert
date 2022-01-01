// const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");

const Users = require(".././models/AllUsers");
const Admin = require("../models/Admin");
const Customer = require("../models/Customer");
const Manager = require("../models/Manager");

const getModel = (data) => {
  if (data.role === "user") return Customer;
  else if (data.role === "manager") return Manager;
  else if (data.role === "admin") return Admin;
  return null;
};

exports.signup = async (req, res, next) => {
  const user = await Users.findOne({ email: req.body.email });

  if (user) return res.status(400).send("This email address already exits.");

  const data = req.body;
  let Model = getModel(data);

  // const salt = await bcrypt.genSalt(10);
  // data.password = await bcrypt.hash(data.password, salt);
  const newUser = new Model(data);
  await newUser.save();

  await Users.create({ email: data.email, role: data.role });

  const token = generateAuthToken(newUser);
  res.status(200).send(token);

  // const role = data.role;
  // let Model;
  // switch (role) {
  //   case "user":
  //     Model = Customer;
  //     if (await Manager.findOne({ email: data.email }))
  //       return res
  //         .status(400)
  //         .send("You are already registered with different role. ");
  //     break;
  //   case "concert manager":
  //     Model = Manager;
  //     if (await Customer.findOne({ email: data.email }))
  //       return res
  //         .status(400)
  //         .send("You are already registered with different role. ");
  //     break;
  //   case "admin":
  //     Model = Admin;
  //     break;
  // }

  // let user = await Model.findOne({ email: req.body.email });
  // if (user) return res.status(400).send("You are already registered");

  // user = new Model(req.body);
  // const salt = await bcrypt.genSalt(10);
  // user.password = await bcrypt.hash(user.password, salt);
  // await user.save();
};

const generateAuthToken = (user) => {
  const obj = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(obj, config.get("jwtKey"));
};

exports.login = async (req, res, next) => {
  let user = await Users.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email/password");

  let Model = getModel(user);

  const userInDB = await Model.findOne({ email: user.email });

  const isCorrect = await user.correctPassword(
    req.body.password,
    userInDB.password
  );
  if (!isCorrect) return res.status(400).send("Invalid email/password");

  res.send(generateAuthToken(userInDB));
  return next();
  // let customer = await Customer.findOne({ email: req.body.email });
  // if (
  //   customer &&
  //   (await bcrypt.compare(req.body.password, customer.password))
  // ) {
  // res.send(generateAuthToken(customer, "customer"));
  // return;
  // }
  // let manager = await Manager.findOne({ email: req.body.email });
  // if (manager && (await bcrypt.compare(req.body.password, manager.password))) {
  //   res.send(generateAuthToken(manager, "manager"));
  //   return;
  // }
  // let admin = await Admin.findOne({ email: req.body.email });

  // if (admin && (await bcrypt.compare(req.body.password, admin.password))) {
  //   res.send(generateAuthToken(admin, "admin"));
  //   return;
  // }
  // next();
};
