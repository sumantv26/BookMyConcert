const Concert = require("../models/ConcertModels/Concert");
// const Manager = require("../models/UserModels/Manager");
const Customer = require("../models/UserModels/Customer");
// const Reviews = require("../models/ConcertModels/Review");
const errIdentifier = require("../utils/errIdentifier");
const imageController = require("./imageController");
const deleteFile = require("../utils/deleteFile");
const Review = require("../models/ConcertModels/Review");
// const { query } = require("express");

const filePath = `${__dirname}/../public/img/concerts`;

exports.verifyConcert = errIdentifier.catchAsync(async (req, res, next) => {
  const concert = await Concert.findById(req.params.id);
  if (!concert)
    return errIdentifier.generateError(
      next,
      "This concert doesn't exits. Try to create one",
      404
    );
  if (concert.postedBy.toString() !== req.user.id)
    errIdentifier.generateError(
      next,
      "You cannot modify this concert as you haven't created it.",
      403
    );
  next();
});

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
  const populateReviews = await Concert.findById(req.params.id).populate({
    path: "reviews",
    options: {
      sort: { rating: -1, updatedAt: -1 },
    },
    populate: {
      path: "customerId",
      options: {
        select: { name: 1, avatar: 1 },
      },
    },
  });

  return res.status(200).json({
    status: "success",
    data: populateReviews,
  });
});

const filterFields = (obj) => {
  // const includedFields = ["search", "artist", "city", "price", "avgRating"];
  // for (const key in obj) if (!includedFields.includes(key)) delete obj[key];
};

exports.getAllPosts = errIdentifier.catchAsync(async (req, res, next) => {
  // filterFields(req.query);
  // const queryObj = { ...req.query };
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // console.log(queryStr);
  // const concerts = Concert.find(JSON.parse(queryStr));
  // console.log(concerts);
  // const allPosts = await Concert.aggregate([
  //   {
  //     $match: {
  //       "timing.from": { $gt: new Date(Date.now()) },
  //     },
  //   },
  //   {
  //     $addFields: {
  //       isTag: {},
  //       isMatched: {
  //         $regexMatch: {
  //           input: "$name",
  //           regex: `${req.query.name}`,
  //         },
  //       },
  //     },
  //   },
  // ]);
  // return res.status(200).json({
  //   length: allPosts.length,
  //   status: "success",
  //   data: allPosts,
  // });
});

exports.getRecents = errIdentifier.catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.size) || 10;
  const recentConcerts = await Concert.aggregate([
    {
      $sort: {
        postedAt: -1,
      },
    },
    {
      $limit: limit,
    },
  ]);
  res.status(200).json({
    status: "success",
    length: recentConcerts.length,
    data: recentConcerts,
  });
});

exports.updatePost = errIdentifier.catchAsync(async (req, res, next) => {
  const currPost = await Concert.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: "success",
    data: currPost,
  });
});

const updateImage = async (id, key, oldFile, newFile) => {
  if (key === "coverImage") {
    await Concert.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          coverImage: newFile,
        },
      }
    );
  } else {
    await Concert.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          "optionalImages.$[element]": newFile,
        },
      },
      {
        arrayFilters: [
          {
            element: {
              $eq: oldFile,
            },
          },
        ],
      }
    );
  }
};

exports.updatePostImage = errIdentifier.catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const key = Object.keys(req.files)[0];
  const prevFilename = req.params?.imgName;
  const newFilename = req.files[key][0].filename;
  const concert = await Concert.findOne({
    $and: [{ _id: id }, { [key]: prevFilename }],
  });
  if (!concert) {
    await deleteFile(filePath, newFilename);
    return errIdentifier.generateError(next, "Unable to update the image", 400);
  }
  updateImage(id, key, prevFilename, newFilename);
  await deleteFile(filePath, prevFilename);
  res.status(200).json({
    status: "success",
    message: `Image updated successfully`,
  });
});

exports.validateUploadIp = errIdentifier.catchAsync(async (req, res, next) => {
  if (!req.files?.optionalImages || req.files.optionalImages.length > 1) {
    return errIdentifier.generateError(next, "Unable to upload image", 400);
  }
  const concert = await Concert.findById(req.params.id);

  const opImgArrLen = concert.optionalImages.length;
  if (opImgArrLen >= 4)
    return errIdentifier.generateError(
      next,
      "Unable to upload image. Try updating it.",
      400
    );
  req.files.index = opImgArrLen;
  next();
});

exports.uploadImage = errIdentifier.catchAsync(async (req, res, next) => {
  const filename = req.files.optionalImages[0].filename;
  const concert = await Concert.findByIdAndUpdate(
    req.params.id,
    {
      $push: { optionalImages: filename },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: concert,
  });
});

const deleteImages = async (post) => {
  const imgKeys = ["coverImage", "optionalImages"];
  for (const key of imgKeys) {
    if (Array.isArray(post[key])) {
      post[key].forEach(async (imgName) => {
        await deleteFile(filePath, imgName);
      });
    } else await deleteFile(filePath, post[key]);
  }
};

exports.deletePost = errIdentifier.catchAsync(async (req, res, next) => {
  const concert = await Concert.findById(req.params.id);
  await Customer.updateOne(
    { isReported: concert._id },
    { $pull: { isReported: concert._id } }
  );
  await Review.deleteMany({ concertId: req.params.id });
  await deleteImages(concert);
  await Concert.deleteOne({ _id: concert._id });
  return res.status(204).json({
    status: "success",
    data: null,
  });
});
