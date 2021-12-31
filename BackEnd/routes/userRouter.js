const express = require("express");
// const userController = require("./../controllers/UserController");
const authController = require("./../controllers/AuthController");
const validateLoginInputs = require("../middleware/validateLoginInputs");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", validateLoginInputs, authController.login);

module.exports = router;
