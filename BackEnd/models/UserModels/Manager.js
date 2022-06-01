const mongoose = require("mongoose");

const Common = require("./Common");
// const Reasons = require("../ConcertModels/Reasons");
const Report = require("../ConcertModels/Report");

const schema = new mongoose.Schema(
  {
    ...Common,
    contactNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountNum: {
      type: String,
      required: true,
      unique: true,
    },
    ifscCode: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    banned: {
      type: Boolean,
      default: false,
    },
    reportId: {
      type: mongoose.ObjectId,
      ref: "Report",
      unique: true,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  const report = await Report.create({ managerId: this._id });
  this.reportId = report._id;
  next();
});

const Manager = mongoose.model("Manager", schema);
module.exports = Manager;
