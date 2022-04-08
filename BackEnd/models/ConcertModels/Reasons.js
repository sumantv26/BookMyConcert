const mongoose = require("mongoose");

const reasonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
  },
  { collection: "report_reasons" }
);

const Reasons = mongoose.model("Reasons", reasonSchema);
module.exports = Reasons;
