const Concert = require("../models/ConcertModels/Concert");
// const Manager = require("../models/UserModels/Manager");
const errIdentifier = require("../utils/errIdentifier");
const imageController = require("./imageController");

exports.uploadConcertImages = imageController.upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "optionalImages", maxCount: 4 },
]);

const updateImages = (req) => {
  for (const key in req.files) {
    if (Object.prototype.hasOwnProperty.call(req.files, key)) {
      if (req.files[key].length === 1) {
        req.body[key] = req.files[key][0].filename;
      } else if (req.files[key].length > 1) {
        req.body[key] = [];
        req.files[key].forEach((img) => {
          req.body[key].push(img.filename);
        });
      }
    }
  }
};

exports.createPost = errIdentifier.catchAsync(async (req, res, next) => {
  if (!req.files)
    errIdentifier.generateError(next, "Cover Image is required", 400);

  updateImages(req);

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
  if (req.files) updateImages(req);

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
