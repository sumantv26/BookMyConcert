const multer = require("multer");
// const sharp = require("sharp");

const getModel = require("../utils/getModel");
const errIdentifier = require("../utils/errIdentifier");
const Concert = require("../models/ConcertModels/Concert");
const Reasons = require("../models/ConcertModels/Reasons");
const Manager = require("../models/UserModels/Manager");
const Report = require("../models/ConcertModels/Report");
const Customer = require("../models/UserModels/Customer");
// const Image = require("../middleware/Image");
// const Image = require("../middleware/newImage");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();

const filterImageFiles = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else errIdentifier.generateError(cb, "Please Upload Only Images", 400, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: filterImageFiles,
});

// exports.updateProfilePhoto = upload.single("avatar");

exports.updateProfilePhoto = function (image) {
  return errIdentifier.catchAsync(async (req, res, next) => {
    console.log(req.body);
    await image.upload.single("avatar");
    next();
  });
};

// exports.resizeProfilePhots = async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat("jpeg")
//     .jpeg({ quality: 70 })
//     .toFile(`public/img/users/${req.file.filename}`);
//   next();
// };

exports.updateUser = errIdentifier.catchAsync(async (req, res, next) => {
  if (req.file) req.body.avatar = req.file.filename;

  const Model = getModel(req.user.role);
  const user = await Model.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-__v -password -isApproved");
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.reportManager = errIdentifier.catchAsync(async (req, res, next) => {
  const concertId = req.params.concertId;

  // Checking if customer is already reported
  const isReported = await Customer.findOne(
    {
      _id: req.user.id,
      isReported: concertId,
    },
    "isReported"
  );

  if (isReported)
    return errIdentifier.generateError(
      next,
      "You have already reported this concert.",
      403
    );

  const currTime = Date.now();
  // Reports can only be reported after concert is over
  const concert = await Concert.findById(concertId);
  if (!concert)
    return errIdentifier.generateError(
      next,
      "You can not report concert manager. This concert doesn't exist.",
      404
    );
  const endTime = concert.timing.to.getTime();
  if (currTime <= endTime)
    return errIdentifier.generateError(
      next,
      "You can not report before concert is over.",
      405
    );

  const reason = await Reasons.findById(req.body.reasonId);
  if (!reason)
    return errIdentifier.generateError(
      next,
      "Please select a valid reason to report.",
      400
    );

  const manager = await Manager.findById(concert.postedBy);
  // create reason docs in report collection
  await Report.updateOne(
    {
      _id: manager.reportId,
      "reportTypes.reasonId": { $ne: reason._id },
    },
    {
      $push: {
        reportTypes: { reasonId: reason._id, count: 0 },
      },
    }
  );
  // increment report count
  await Report.updateOne(
    {
      _id: manager.reportId,
    },
    {
      $inc: { "reportTypes.$[x].count": 1 },
    },
    {
      arrayFilters: [{ "x.reasonId": reason._id }],
    }
  );

  await Customer.updateOne(
    {
      _id: req.user.id,
      isReported: { $ne: concertId },
    },
    { $push: { isReported: concertId } }
  );
  res.status(200).json({
    status: "success",
    message: "Your report has been successfully submitted.",
  });
});

exports.getReasons = errIdentifier.catchAsync(async (req, res, next) => {
  const allReasons = await Reasons.find({}).select("-__v");
  res.status(200).json({
    status: "success",
    data: allReasons,
  });
});

// const report = Report.findById(manager.reportId);
// const remove = await Report.updateOne(
//   { _id: manager.reportId.toString() },
//   {
//     $pull: { "reportTypes.reasonId": reason._id },
//   }
// );
// const add = await Report.updateOne(
//   { _id: manager.reportId.toString() },
//   {
//     $push: {
//       reportTypes: { reasonId: reason._id, count: 0 },
//     },
//   }
// );
// console.log(add);
// if (!isReason) {
//   const updatedDoc = Report.updateOne({ _id: manager.reportId }, {
//     "reportTypes"
//   });

// }
// const reportedDoc = report.findOne({
//   "reportTypes.reasonId": reason._id.toString(),
// });
// console.log(reportedDoc);

// const { reportTypes } = report;
// const idx = reportTypes.findIndex((doc, i) => {
//   if (doc.reasonId.equals(reason._id)) return i;
// });
// reportTypes[idx].count++;
// report.save();
// const report = await Report.findOne({
//   "reportTypes.reasonId": manager.reportId.toString(),
//   // reportTypes: { $elemMatch: { reasonId: manager.reportId } },
// });
// const report = await Report.update(
//   { _id: manager.reportId, "reportTypes.reasonId": reason._id },
//   {
//     $set: { "reportType.$.count": { $inc: 1 } },
//   }
// );
// console.log(report);

// const manager = await Model.Manager.findById(concert.postedBy);
// for (const reportObj of manager.reportTypes) {
//   if (reportObj.reasonId.equals(reasonId)) {
//     const obj = await Model.Report.find({});
//     // const obj = await Model.Report.findByIdAndUpdate(
//     //   reportObj._id,
//     //   {
//     //     $inc: { counts: 1 },
//     //   },
//     //   { new: true }
//     // );
//     console.log(obj);
//     break;
//   }
// }
// console.log(manager);
// const manager = await Manager.findById(concert.postedBy);
// for (const reportObj of manager.reportTypes) {
//   if (reportObj.reasonId === reasonId) {
//     reportObj.counts++;
//     break;
//   }
// }
// console.log(manager);
