const express = require("express");

// const {
//   getUserById,
//   getOwnData,
//   getMulterForAvatar,
//   updateUserData,
// } = require("../controllers/usersController");
const customerRouter = require("./customerRoutes");
const validate = require("../middleware/inputValidation");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const adminRouter = require("./adminRoutes");
const newImage = require("../middleware/newImage");
const profileImage = new newImage("profilePhoto");
// const managerRoutes = require("./managerRoutes");
// const adminRoutes = require("./adminRoutes");
// const { identifyRole } = require("../middleware/identifyRole");
// const validateObjectId = require("../middleware/validateObjectId");
// const adminRouter = require("./adminRoutes");

const router = express.Router();
// const upload = getMulterForAvatar();

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
  userController.updateProfilePhoto(profileImage),
  validate.userUpdateIp,
  profileImage.configureImages(),
  userController.updateUser
);

router.use("/", customerRouter);
router.use("/admin", adminRouter);
// router.get("/post", postController.getAllPosts);
// router.get("/post/:id", postController.getPost);
// // ADMIN ROUTES
// router.use("/", adminRoutes);
// // MANAGER ROUTES
// router.use("/", managerRoutes);
// CUSTOMER ROUTES

// router.use("/admin", authAdmin, adminRouter);
// router.get("/", authAdmin, identifyRole, getUserById);
// router.get("/auth/me", identifyRole, getOwnData);
// router.put("/auth/me", identifyRole, upload.single("avatar"), updateUserData);

module.exports = router;
