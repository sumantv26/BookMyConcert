const jwt = require("jsonwebtoken");
const config = require("config");

module.exports.authUsers = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .send("No token provided. Access Denied. login/signup again.");
  try {
    const decode = jwt.verify(token, config.get("jwtKey"));
    req.user = decode;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token!");
  }
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
