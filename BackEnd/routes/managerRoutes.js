const express = require("express");

const validate = require("../middleware/inputValidation");
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");

const router = express.Router();

router.use(
  authController.restrictTo("manager"),
  authController.isManagerApproved
);

router.post("/post", validate.concertIp, postController.createPost);
router
  .route("/post/:id")
  .patch(validate.postUpdateIp, postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
