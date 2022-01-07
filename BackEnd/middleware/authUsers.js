const { promisify } = require("util");

const jwt = require("jsonwebtoken");
const config = require("config");

const { getModel } = require("./identifyRole");
const Users = require("../models/AllUsers");

const isJWTExpired = (jwtIssuedAt, changedPasswordTime) => {
  if (changedPasswordTime) {
    const passwordChangedAt = parseInt(changedPasswordTime.getTime() / 1000);

    return jwtIssuedAt < passwordChangedAt;
  }
  return false;
};

module.exports.authenticateUsers = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({
      status: "fail",
      message: "You are not LoggedIn/SignedUp.",
    });
  const decoded = await promisify(jwt.verify)(token, config.get("jwtKey"));
  // 1. Check if user exists
  const user = Users.findOne({ _id: decoded._id });
  if (!user)
    return res.status(401).json({
      status: "fail",
      messsage: "Invalid email or password",
    });
  // 2. Check is password is changes or not
  const Model = getModel(user.role);
  const reqUser = await Model.findOne({ _id: user._id });
  if (isJWTExpired(decoded.iat, reqUser.passwordChangedAt)) {
    return res.status(401).json({
      status: "fail",
      messsage:
        "Password is changed since you last login. Please try login again.",
    });
  }

  // 3. Get the role and take appropriate actions
  // if (user.role === "manager") {
  //   const userMgr = Manager.findOne({ _id: user._id });
  //   if (!userMgr.isApproved) {
  //     // some error
  //   }
  // }

  req.user = decoded;
  next();
};

module.exports.authAdmin = (req, res, next) => {
  if (!(req.user.role && req.user.role === "admin"))
    return res.status(403).send("access denied. you are not an admin");
  next();
};
module.exports.authManagers = (req, res, next) => {
  if (!(req.user.role && req.user.role === "manager"))
    return res.status(403).send("access denied. you are not a manager");
  next();
};
module.exports.authCustomer = (req, res, next) => {
  if (!(req.user.role && req.user.role === "customer"))
    return res.status(403).send("access denied. you are not a manager");
  next();
};
