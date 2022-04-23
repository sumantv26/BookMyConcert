const express = require("express");

const adminRouter = require("./adminRoutes");
const customerRouter = require("./customerRoutes");
const validate = require("../middleware/inputValidation");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const imageController = require("../controllers/imageController");

const router = express.Router();

router.post("/signup", validate.signupIp, authController.signup);
router.post("/login", validate.loginIp, authController.login);

router.post("/forgotPassword", validate.emailIp, authController.forgotPassword);
router.patch(
  "/resetPassword/:token",
  validate.passwordIp,
  authController.resetPassword
);

router.get("/cities", userController.getCities);

router.use(authController.protected);

router.get("/me", userController.getMe);

router.patch(
  "/me/update",
  userController.updateProfilePhoto,
  validate.userUpdateIp,
  imageController.configureImages,
  userController.updateUser
);

router.delete("/me/remove-image", userController.removeImage);
router.delete("/me", userController.deleteMe);

router.use("/admin", adminRouter);
router.use("/", customerRouter);

module.exports = router;
