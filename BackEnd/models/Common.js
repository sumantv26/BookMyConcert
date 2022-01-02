const common = {
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // contactNumber: {
  //   type: Number,
  //   required: true,
  //   unique: true,
  // },
  // birthDate: {
  //   type: Date,
  //   required: true,
  // },
  // gender: {
  //   type: String,
  //   required: true,
  // },
  avatar:{type:String,default:"avatar.png"},
  role: {
    type: String,
    required: true,
    enum: ["customer", "manager", "admin"],
  },
};
module.exports = common;
