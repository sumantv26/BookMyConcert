const express = require("express");

const validate = require("../middleware/inputValidation");
const authController = require("../controllers/authController");
const concertController = require("../controllers/concertController");

const router = express.Router();

router.use(
  authController.restrictTo("manager"),
  authController.isManagerApproved
);

router.post("/withdraw/:concertId", concertController.withdrawAmt);

router.get("/my-concerts", concertController.getAllConcerts);

router.post("/post", validate.concertIp, concertController.createPost);
router
  .route("/post/:id")
  .patch(validate.concertUpdateIp, concertController.updatePost)
  .delete(concertController.deletePost);

module.exports = router;
