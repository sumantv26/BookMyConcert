const getModel = require("../utils/getModel");
const errIdentifier = require("../utils/errIdentifier");
const Concert = require("../models/ConcertModels/Concert");
const Reasons = require("../models/ConcertModels/Reasons");
const Manager = require("../models/UserModels/Manager");
const Report = require("../models/ConcertModels/Report");
const Customer = require("../models/UserModels/Customer");
const imageController = require("./imageController");
const deleteFile = require("../utils/deleteFile");

const filePath = `${__dirname}/../public/img/users`;
exports.updateProfilePhoto = imageController.upload.single("avatar");

exports.getMe = errIdentifier.catchAsync(async (req, res, next) => {
  const Model = getModel(req.user.role);
  const user = await Model.findById(req.user.id).select(
    "-__v -password -isApproved"
  );
  if (!user) return errIdentifier.generateError(next, "User not found", 404);
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.removeImage = errIdentifier.catchAsync(async (req, res, next) => {
  const Model = getModel(req.user.role);
  const user = await Model.findById(req.user.id);
  req.user.avatar = user.avatar;
  if (!user.avatar !== "default.jpeg") await deleteFile(filePath, user.avatar);
  const updatedUser = await Model.findByIdAndUpdate(
    req.user.id,
    { $unset: { avatar: "" } },
    {
      new: true,
      runValidators: true,
    }
  ).select("-__v -password -isApproved");
  if (!updatedUser)
    return errIdentifier.generateError(next, "Unable to remove image", 400);
  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

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
