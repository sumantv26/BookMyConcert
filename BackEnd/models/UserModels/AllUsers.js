const crypto = require("crypto");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["customer", "manager", "admin"],
    immutable: true,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.methods.isJWTExpired = function (jwtIssuedAt) {
  if (this.passwordChangedAt) {
    const inSecs = parseInt(this.passwordChangedAt.getTime() / 1000);

    return jwtIssuedAt < inSecs;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.resetPasswordFields = async function () {
  this.passwordResetToken = undefined;
  this.passwordResetExpires = undefined;
  await this.save({ validateBeforeSave: false });
};

const Users = mongoose.model("AllUsers", userSchema);

module.exports = Users;
