const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    concertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Concerts",
      required: true,
      immutable: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      require: true,
      immutable: true,
    },
    price: {
      type: Number,
      required: true,
    },
    noOfBookings: {
      type: Number,
      default: 1,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

// schema.pre(/^find/, function (next) {
//   this.populate({
//     path: "concertId",
//     select: {
//       name: 1,
//       coverImage: 1,
//     },
//   });
//   .populate({
//   path: "customerId",
//   select: {
//     name: 1,
//     avatar: 1,
//   },
// });
//   next();
// });

const Booking = mongoose.model("Booking", schema);

module.exports = Booking;
