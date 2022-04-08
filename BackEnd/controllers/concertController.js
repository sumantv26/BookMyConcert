const Concert = require("../models/ConcertModels/Concert");
// const Manager = require("../models/UserModels/Manager");
const errIdentifier = require("../utils/errIdentifier");
// const Image = require("../middleware/Image");

// exports.uploadCoverImage = Image.upload.single("coverImage");
// exports.uploadImages = Image.upload.array("images", 4);
// exports.uploadConcertImages = Image.upload.fields([
//   { name: "coverImage", maxCount: 1 },
//   { name: "images", maxCount: 4 },
// ]);

exports.createPost = errIdentifier.catchAsync(async (req, res, next) => {
  // if (!req.files)
  //   errIdentifier.generateError(next, "Cover Image is required", 400);
  // req.body.coverImage = req.file.filename;
  const newPost = await Concert.create(req.body);
  return res.status(201).json({
    status: "success",
    data: newPost,
  });
});

exports.getPost = errIdentifier.catchAsync(async (req, res, next) => {
  const fetchedPost = await Concert.findById(req.params.id).populate({
    path: "reviews",
    options: { sort: { rating: -1, updatedAt: -1 } },
  });
  if (!fetchedPost)
    return errIdentifier.generateError(
      next,
      "This concert doesn't exits. Try to create one",
      404
    );
  return res.status(200).json({
    status: "success",
    data: fetchedPost,
  });
});

exports.getAllPosts = errIdentifier.catchAsync(async (req, res, next) => {
  const allPosts = await Concert.find();
  return res.status(200).json({
    length: allPosts.length,
    status: "success",
    data: allPosts,
  });
});

exports.updatePost = errIdentifier.catchAsync(async (req, res, next) => {
  console.log(req.file);
  if (req.file) {
    // req.body.images = req.file.map((img) => img);
  }

  const currPost = await Concert.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!currPost)
    return errIdentifier.generateError(
      next,
      "This concert doesn't exits. Try to create one",
      404
    );
  return res.status(200).json({
    status: "success",
    data: currPost,
  });
});

exports.deletePost = errIdentifier.catchAsync(async (req, res, next) => {
  const post = await Concert.findByIdAndDelete(req.params.id);
  if (!post) {
    return errIdentifier.generateError(
      next,
      "This concert doesn't exits. Try to create one",
      404
    );
  }

  return res.status(204).json({
    status: "success",
    data: null,
  });
});
