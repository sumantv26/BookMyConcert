const express = require("express");

const validate = require("../middleware/inputValidation");
const authController = require("../controllers/authController");
const concertController = require("../controllers/concertController");
// const Image = require("../middleware/Image");

const router = express.Router();

router.get("/", concertController.getAllPosts);
router.get("/:id", concertController.getPost);

router.use(
  authController.protected,
  authController.restrictTo("manager"),
  authController.isManagerApproved
);

// router.post(
//   "/create",
//   concertController.uploadConcertImages,
//   validate.concertIp,
//   Image.configureImages(new Image("coverImage")),
//   concertController.createPost
// );

// router
//   .route("/:id")
//   .patch(
//     concertController.uploadConcertImages,
//     validate.concertUpdateIp,
//     Image.configureImages(new Image("coverImage")),
//     concertController.updatePost
//   )
//   .delete(concertController.deletePost);

module.exports = router;
