const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const util = require("util");

const sendEmail = require("../utils/email");
const getModel = require("../utils/getModel");
const errIdentifier = require("../utils/errIdentifier");
const Users = require("../models/UserModels/AllUsers");

const generateAuthToken = (user) => {
  const userData = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(userData, process.env.SECRET_KEY);
};

const saveUserInDB = async (role, req, id = null) => {
  let Model = getModel(role);
  let user;
  if (id) user = await Model.findById(id);
  else user = new Model(req.body);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();
  return user;
};

exports.signup = errIdentifier.catchAsync(async (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  const user = await Users.findOne({ email: req.body.email });
  if (user)
    return errIdentifier.generateError(
      next,
      "This email is already registered",
      409
    );

  const newUser = await saveUserInDB(req.body.role, req);
  await Users.create({
    email: newUser.email,
    role: newUser.role,
    _id: newUser._id,
  });

  const token = generateAuthToken(newUser);

  return res.status(200).json({
    status: "success",
    token,
  });
});

exports.login = errIdentifier.catchAsync(async (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  let user = await Users.findOne({ email: req.body.email });
  if (!user)
    return errIdentifier.generateError(next, "Invalid email or password", 401);
  const Model = getModel(user.role);
  const userInDB = await Model.findOne({ email: user.email });
  const isValid = await bcrypt.compare(req.body.password, userInDB.password);
  if (!isValid)
    return errIdentifier.generateError(next, "Invalid email or password", 401);
  const token = generateAuthToken(userInDB);
  return res.status(200).json({
    status: "success",
    token,
  });
});

exports.protected = errIdentifier.catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return errIdentifier.generateError(
      next,
      "You are not LoggedIn/SignedUp.",
      401
    );
  }

  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_KEY
  );

  const user = await Users.findById(decoded.id);
  if (!user)
    return errIdentifier.generateError(next, "Invalid email or password", 401);

  if (user.isJWTExpired(decoded.iat))
    return errIdentifier.generateError(
      next,
      "Password is changed since you last login. Please try login again.",
      401
    );
  req.user = decoded;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, _, next) => {
    let rolesStr = "";
    for (const role of roles) rolesStr += role + "s";
    rolesStr = rolesStr.split(" ").join(", ");
    if (!roles.includes(req.user.role))
      return errIdentifier.generateError(
        next,
        `Access Denied! This route can only be accessed by Concert ${rolesStr}.`,
        403
      );
    next();
  };
};

exports.isManagerApproved = async (req, res, next) => {
  const Model = getModel(req.user.role);
  const user = await Model.findById(req.user.id);
  if (user.isApproved) return next();
  return res.status(403).json({
    status: "fail",
    message: "Access Denied! You are not a verified as a Concert Manager.",
  });
};

exports.forgotPassword = errIdentifier.catchAsync(async (req, res, next) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user)
    return res.status(200).json({
      message: "We've sent you an email. Please check your inbox",
    });
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/users/resetPassword/${resetToken}`;

  const message = `If you forgot your password, please click to this url ${resetUrl} to reset your password. If you haven't requested for password reset, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token (valid for 10 mins only)",
      message,
    });
    return res.status(200).json({
      status: "success",
      message: "Reset password token is being sent to your email",
    });
  } catch (err) {
    user.resetPasswordFields();
    return errIdentifier.generateError(
      next,
      "An error occured while sending an email, pleace try again later.",
      500
    );
  }
});

exports.resetPassword = errIdentifier.catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await Users.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user)
    return errIdentifier.generateError(
      next,
      "Token is invalid or has expired",
      400
    );

  saveUserInDB(user.role, req, user._id);
  user.resetPasswordFields();
  const token = generateAuthToken(user);
  res.status(200).json({
    status: "success",
    token,
  });
});
