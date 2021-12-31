const express = require("express");
// const userController = require("./../controllers/UserController");
const authController = require("./../controllers/AuthController");
const inputValidation = require("../middleware/ValidateInputFields");

const router = express.Router();

router.post("/signup", inputValidation.validateSignup, authController.signup);
router.post("/login", inputValidation.validateLogin, authController.login);

module.exports = router;
