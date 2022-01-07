// const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");

const Users = require("../models/AllUsers");
const { getModel } = require("../middleware/identifyRole");

const generateAuthToken = (user) => {
  const obj = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(obj, config.get("jwtKey"));
};

exports.signup = async (req, res, next) => {
  const user = await Users.findOne({ email: req.body.email });
  if (user)
    return res.status(409).json({
      status: "fail",
      message: "This email is already registered",
    });

  const data = req.body;
  let Model = getModel(data.role);

  const newUser = new Model(data);
  const salt = await bcrypt.genSalt(10);

  newUser.password = await bcrypt.hash(newUser.password, salt);
  await newUser.save();

  await Users.create({ email: data.email, role: data.role });
  const token = generateAuthToken(newUser);

  res.status(200).json({
    status: "success",
    data: token,
  });
};

exports.login = async (req, res, next) => {
  let user = await Users.findOne({ email: req.body.email });
  if (!user)
    return res.status(401).json({
      status: "fail",
      messsage: "Invalid email or password",
    });
  let Model = getModel(user.role);
  const userInDB = await Model.findOne({ email: user.email });
  // if (userInDB.role === "manager" && !userInDB.isApproved) {
  //   return res
  //     .status(401)
  //     .json({
  //       status: "fail",
  //       message: "You are not verified as concert manager."
  //     });
  // }
  const isValid = await bcrypt.compare(req.body.password, userInDB.password);
  if (!isValid)
    return res.status(401).json({
      status: "fail",
      messsage: "Invalid email or password",
    });
  const token = generateAuthToken(userInDB);
  res.status(200).json({
    status: "success",
    data: token,
  });
};

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

//login
// let user = await Model.findOne({ email: req.body.email });
// if (user) return res.status(400).send("You are already registered");

// user = new Model(req.body);
// const salt = await bcrypt.genSalt(10);
// user.password = await bcrypt.hash(user.password, salt);
// await user.save();
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
