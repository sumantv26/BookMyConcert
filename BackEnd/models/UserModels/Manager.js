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
    creditCardNum: {
      type: Number,
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
// function validateManager(user) {
//   const schema = Joi.object({
//     // name: Joi.string().min(3).max(225).required(),
//     // email: Joi.string().email().min(3).max(225).required(),
//     // password: Joi.string().min(5).max(1024),
//     contactNumber: Joi.string()
//       .length(10)
//       .pattern(/^[0-9]+$/)
//           .required(),
//       creditCardNum: Joi.number().length(16).required(),
//     isApproved: Joi.boolean().default(false),
//   });
//   return schema.validate(user);
// }

// exports.validateManager = validateManager;

// const reportSchema = new mongoose.Schema({
//   reasonId: {
//     type: mongoose.ObjectId,
//     require: true,
//     unique: true,
//     ref: "Reasons",
//   },
//   count: {
//     type: Number,
//     default: 0,
//   },
// });

// reportTypes: {
//     type: [
//       {
//         reasonId: {
//           type: mongoose.ObjectId,
//           require: true,
//           ref: "Reasons",
//         },
//         counts: {
//           type: Number,
//           default: 0,
//         },
//       },
//     ],
//   },
