const mongoose = require("mongoose");
const Common = require("./Common");

const schema = new mongoose.Schema({
  ...Common,
});

const Admin = mongoose.model("Admin", schema);

module.exports = Admin;
