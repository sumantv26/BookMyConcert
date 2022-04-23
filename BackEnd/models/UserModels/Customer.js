const mongoose = require("mongoose");
const Common = require("./Common");

const schema = new mongoose.Schema({
  ...Common,
  isReported: {
    type: [mongoose.ObjectId],
    ref: "Concert",
    select: false,
  },
});

const Customer = mongoose.model("Customer", schema);

module.exports = Customer;
