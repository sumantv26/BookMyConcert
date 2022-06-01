const express = require("express");

const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.use(authController.protected);

router.get(
  "/checkout-session/:concertId",
  // authController.restrictTo("customer"),
  bookingController.getCheckoutSession
);

router.use(authController.restrictTo("manager", "admin"));
router.get("/:concertId", bookingController.getAllBookings);
module.exports = router;
