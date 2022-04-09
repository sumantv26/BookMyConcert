const express = require("express");

const customerRouter = require("./customerRoutes");
const validate = require("../middleware/inputValidation");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const imageController = require("../controllers/imageController");
const adminRouter = require("./adminRoutes");

const router = express.Router();

router.post("/signup", validate.signupIp, authController.signup);
router.post("/login", validate.loginIp, authController.login);

router.post("/forgotPassword", validate.emailIp, authController.forgotPassword);
router.patch(
  "/resetPassword/:token",
  validate.passwordIp,
  authController.resetPassword
);

router.use(authController.protected);

router.patch(
  "/update",
  userController.updateProfilePhoto,
  validate.userUpdateIp,
  imageController.configureImages,
  // imageController.deletePrevious,
  userController.updateUser
);

router.use("/", customerRouter);
router.use("/admin", adminRouter);

module.exports = router;
