const express = require("express");

const reviewRouter = require("./reviewRoutes");
const validate = require("../middleware/inputValidation");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.restrictTo("customer"));

router.use("/review", reviewRouter);

router.get("/report", userController.getReasons);
router.patch(
  "/report/:concertId",
  validate.reportIp,
  userController.reportManager
);

module.exports = router;
