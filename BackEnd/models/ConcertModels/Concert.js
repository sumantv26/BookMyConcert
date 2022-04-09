const mongoose = require("mongoose");
// const Review = require("../ConcertModels/Review");

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "Point",
    enum: ["Point"],
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  address: String,
  city: {
    type: String,
    required: true,
  },
});

const timingSchema = new mongoose.Schema(
  {
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: [String],
      required: true,
    },
    timing: {
      type: timingSchema,
      required: true,
    },
    venue: {
      type: pointSchema,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
      unique: true,
    },
    optionalImages: {
      type: [String],
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    avgRating: {
      type: Number,
      default: 1,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    noOfRatings: {
      type: Number,
      default: 0,
    },
    postedBy: {
      type: mongoose.ObjectId,
      ref: "Manager",
      required: true,
      immutable: true,
    },
    postedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.virtual("reviews", {
  ref: "review",
  foreignField: "concertId",
  localField: "_id",
});

const Concerts = mongoose.model("Concerts", schema);

module.exports = Concerts;
