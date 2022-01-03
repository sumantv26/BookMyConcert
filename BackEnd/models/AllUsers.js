const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["customer", "manager", "admin"],
  },
});

const Users = mongoose.model("AllUsers", userSchema);

module.exports = Users;
