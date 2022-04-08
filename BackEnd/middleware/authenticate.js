// const util = require("util");

// const jwt = require("jsonwebtoken");

// const getModel = require("./getModel");
// const Users = require("../models/UserModels/AllUsers");
// const errIdentifier = require("../utils/errIdentifier");

// // const isJWTExpired = (jwtIssuedAt, changedPasswordTime) => {
// //   if (changedPasswordTime) {
// //     const passwordChangedAt = parseInt(changedPasswordTime.getTime() / 1000);

// //     return jwtIssuedAt < passwordChangedAt;
// //   }
// //   return false;
// // };

// exports.authProtected = errIdentifier.catchAsync(async (req, res, next) => {
//   const token = req.headers.authorization.split(" ")[1];
//   if (!token)
//     return errIdentifier.generateError(
//       next,
//       "You are not LoggedIn/SignedUp.",
//       401
//     );
//   const decoded = await util.promisify(jwt.verify)(
//     token,
//     process.env.SECRET_KEY
//   );
//   // 1. Check if user exists
//   const user = await Users.findById(decoded.id);
//   if (!user)
//     return errIdentifier.generateError(next, "Invalid email or password", 401);

//   // const Model = getModel(user.role);
//   // const reqUser = await Model.findById(user._id);
//   if (user.isJWTExpired(decoded.iat))
//     return generateError(
//       next,
//       "Password is changed since you last login. Please try login again.",
//       401
//     );

//   // 3. Get the role and take appropriate actions
//   // if (user.role === "manager") {
//   //   const userMgr = Manager.findOne({ _id: user._id });
//   //   if (!userMgr.isApproved) {
//   //     // some error
//   //   }
//   // }

//   req.user = decoded;
//   next();
// });

// exports.restrictTo = (...roles) => {
//   return (req, _, next) => {
//     if (!roles.includes(req.user.role))
//       return errIdentifier.generateError(
//         next,
//         "Access Denied! This route can only be accessed by Concert Managers.",
//         403
//       );
//     next();
//   };
// };

// exports.authAdmin = (req, res, next) => {
//   if (!(req.user?.role === "admin"))
//     return res.status(403).send("access denied. you are not an admin");
//   next();
// };

// exports.authManagers = (req, res, next) => {
//   if (!(req.user?.role === "manager"))
//     return res.status(403).json({
//       status: "fail",
//       message:
//         "Access Denied! This route can only be accessed by Concert Managers.",
//     });
//   next();
// };

// exports.isManagerApproved = async (req, res, next) => {
//   const Model = getModel(req.user.role);
//   const user = await Model.findById(req.user.id);
//   if (user.isApproved) return next();
//   return res.status(403).json({
//     status: "fail",
//     message: "Access Denied! You are not a verified as a Concert Manager.",
//   });
// };

// exports.authCustomer = (req, res, next) => {
//   if (!(req.user.role && req.user.role === "customer"))
//     return res.status(403).send("access denied. you are not a manager");
//   next();
// };
