const express = require("express");

const {
  getUserById,
  getOwnData,
  getMulterForAvatar,
  updateUserData,
} = require("../controllers/usersController");

const {
  authenticateUsers,
  authManagers,
  authAdmin,
} = require("../middleware/authUsers");

const { identifyRole } = require("../middleware/identifyRole");
const validateObjectId = require("../middleware/validateObjectId");
const authController = require("../controllers/AuthController");
const {
  validateSignup,
  validateLogin,
} = require("../middleware/ValidateInputFields");
const adminRouter = require("./adminRoutes");

const asyncMiddleware = require("../middleware/asyncMiddleware");

const router = express.Router();
const upload = getMulterForAvatar();

router.post("/signup", validateSignup, authController.signup);
router.post("/login", validateLogin, authController.login);

router.use(authenticateUsers);
router.use("/admin", authAdmin, adminRouter);
router.get("/", authAdmin, identifyRole, getUserById);
router.get("/auth/me", identifyRole, getOwnData);
router.put("/auth/me", identifyRole, upload.single("avatar"), updateUserData);

module.exports = router;
