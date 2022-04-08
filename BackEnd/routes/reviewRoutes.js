const express = require("express");

const reviewController = require("../controllers/reviewController");
const validate = require("../middleware/inputValidation");

const router = express.Router();

router.get("/", reviewController.getReviews);
router.post("/:concertId", validate.reviewIp, reviewController.createReview);
router.patch(
  "/:reviewId",
  validate.reviewUpdateIp,
  reviewController.updateReview
);
router.delete("/:reviewId", reviewController.deleteReview);

module.exports = router;
