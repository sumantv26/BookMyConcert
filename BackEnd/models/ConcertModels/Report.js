const mongoose = require("mongoose");

// const Reasons = require("../ConcertModels/Reasons");

const schema = new mongoose.Schema(
  {
    reportTypes: [
      {
        reasonId: {
          type: mongoose.ObjectId,
          ref: "Reasons",
          require: true,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
    managerId: {
      type: mongoose.ObjectId,
      ref: "Manager",
      require: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.virtual("manager", {
  ref: "Manager",
  foreignField: "_id",
  localField: "managerId",
});

schema.virtual("reason", {
  ref: "Reason",
  foreignField: "_id",
  localField: "reportTypes.reasonId",
});

const Report = mongoose.model("report", schema);

module.exports = Report;
