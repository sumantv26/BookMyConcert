const common = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  avatar: { type: String, default: "default.jpg" },
  role: {
    type: String,
    required: true,
    enum: ["customer", "manager", "admin"],
    immutable: true,
  },
};

module.exports = common;
