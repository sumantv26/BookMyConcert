const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  concertId: {
    type: mongoose.ObjectId,
    ref: "Concert",
    required: true,
    immutable: true,
  },
  customerId: {
    type: mongoose.ObjectId,
    ref: "Customer",
    require: true,
    immutable: true,
  },
  noOfBooking: {
    type: Number,
    default: 1,
    require: true,
  },
});
