const express = require("express");
const {
  getUserById,
  getOwnData,
  getMulterForAvatar,
  updateUserData,
} = require("../controllers/usersController");
const {
  authUsers,
  authManagers,
  authAdmin,
} = require("../middleware/authUsers");
const { identifyRole } = require("../middleware/identifyRole");
const validateObjectId = require("../middleware/validateObjectId");
const authController = require("./../controllers/AuthController");
const inputValidation = require("../middleware/ValidateInputFields");
const router = express.Router();
const upload = getMulterForAvatar();

router.post("/signup", inputValidation.validateSignup, authController.signup);
router.post("/login", inputValidation.validateLogin, authController.login);

router.use(authUsers);
router.get("/", authAdmin, identifyRole, getUserById);
router.get("/auth/me", identifyRole, getOwnData);
router.put("/auth/me", identifyRole, upload.single("avatar"), updateUserData);
module.exports = router;
