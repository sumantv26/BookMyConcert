const errIdentifier = require("../utils/errIdentifier");
const mongoose = require("mongoose");
const Review = require("../models/ConcertModels/Review");

exports.createReview = errIdentifier.catchAsync(async (req, res, next) => {
  const countReviews = await Review.aggregate([
    {
      $match: {
        $and: [
          { customerId: mongoose.Types.ObjectId(req.user.id) },
          { concertId: mongoose.Types.ObjectId(req.params.concertId) },
        ],
      },
    },
    {
      $count: "noOfReviews",
    },
  ]);
  console.log(countReviews);
  if (countReviews[0]?.noOfReviews >= 1)
    return errIdentifier.generateError(
      next,
      "You can't post more than 1 review on the concert",
      403
    );

  const newReview = await Review.create({
    review: req.body?.review,
    rating: req.body.rating,
    concertId: req.params.concertId,
    customerId: req.user.id,
  });
  res.status(201).json({
    status: "success",
    data: newReview,
  });
});

exports.getReviews = errIdentifier.catchAsync(async (req, res, next) => {
  const userReviews = await Review.aggregate([
    {
      $match: {
        customerId: mongoose.Types.ObjectId(req.user.id),
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $project: {
        __v: 0,
      },
    },
  ]);
  const populateConcerts = await Review.populate(userReviews, {
    path: "concertId",
    options: { select: { name: 1, description: 1, coverImage: 1 } },
  });

  const populateCustomer = await Review.populate(populateConcerts, {
    path: "customerId",
    options: { select: { name: 1, image: 1 } },
  });

  res.status(200).json({
    status: "success",
    data: populateCustomer,
  });
});

exports.updateReview = errIdentifier.catchAsync(async (req, res, next) => {
  const updatedReview = await Review.findByIdAndUpdate(
    req.params.reviewId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: updatedReview,
  });
});

exports.deleteReview = errIdentifier.catchAsync(async (req, res, next) => {
  const deletedReview = await Review.findByIdAndDelete(req.params.reviewId);
  res.status(204).json({
    status: "success",
    data: deletedReview,
  });
});
