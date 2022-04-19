const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    coordinates: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      longitude: {
        type: Number,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
    },
  },
  { collection: "cities" }
);

const Cities = mongoose.model("Cities", citySchema);
module.exports = Cities;
