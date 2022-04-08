const mongoose = require("mongoose");
const Concert = require("./Concert");

const schema = new mongoose.Schema(
  {
    review: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    concertId: {
      type: mongoose.ObjectId,
      ref: "Concerts",
      required: true,
    },
    customerId: {
      type: mongoose.ObjectId,
      ref: "Customer",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ concertId: 1, customerId: 1 }, { unique: true });

schema.statics.calcAvgRating = async function (concertId) {
  const aggrRating = await this.aggregate([
    {
      $match: { concertId },
    },
    {
      $group: {
        _id: "concertId",
        noOfRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (aggrRating.length >= 1)
    await Concert.findByIdAndUpdate(concertId, {
      avgRating: aggrRating[0].avgRating,
      noOfRatings: aggrRating[0].noOfRatings,
    });
};

schema.post("save", function () {
  this.constructor.calcAvgRating(this.concertId);
});

schema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.clone().findOne();
  next();
});

schema.post(/^findOneAnd/, function () {
  this.model.calcAvgRating(this.review.concertId);
});

const Review = mongoose.model("review", schema);

module.exports = Review;
