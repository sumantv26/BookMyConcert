const errIdentifier = require("../utils/errIdentifier");
const Report = require("../models/ConcertModels/Report");
const Manager = require("../models/UserModels/Manager");
// const mongoose = require("mongoose");
// const util = require("util");

exports.requestedApproval = errIdentifier.catchAsync(async (req, res, next) => {
  const toBeApproved = await Manager.aggregate([
    { $match: { isApproved: false, banned: false } },
    { $sort: { createdAt: 1 } },
    { $project: { name: 1, avatar: 1, isApproved: 1 } },
  ]);
  res.status(200).json({
    status: "success",
    data: toBeApproved,
  });
});

exports.approveManager = errIdentifier.catchAsync(async (req, res, next) => {
  const manager = await Manager.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true, validateBeforeSave: false }
  ).select("name avatar isApproved");
  if (!manager)
    return errIdentifier.generateError(next, "Manager doesn't exists!!", 404);

  res.status(200).json({
    status: "success",
    data: manager,
  });
});

exports.getReportedManagers = errIdentifier.catchAsync(
  async (req, res, next) => {
    const reportedManagers = await Report.aggregate([
      {
        $match: {
          "reportTypes.0": {
            $exists: true,
          },
        },
      },
      {
        $unwind: "$reportTypes",
      },
      {
        $sort: {
          "reportTypes.count": -1,
        },
      },
      {
        $group: {
          _id: "$managerId",
          reportTypes: {
            $push: "$reportTypes",
          },
          totalCount: {
            $sum: "$reportTypes.count",
          },
        },
      },
      {
        $addFields: {
          managerId: "$_id",
        },
      },
      {
        $sort: {
          totalCount: -1,
        },
      },
      {
        $project: {
          _id: 0,
          managerId: 1,
          reportTypes: 1,
          totalCount: 1,
        },
      },
    ]);
    let populatedManager = await Report.populate(reportedManagers, {
      path: "manager",
      options: { select: { name: 1, avatar: 1 } },
      match: { banned: false, "manager.0": { $exists: true } },
    });

    populatedManager.forEach((doc, i) => {
      if (doc.manager.length === 0) populatedManager.splice(i, 1);
    });

    const final = await Report.populate(populatedManager, {
      path: "reportTypes.reasonId",
    });
    res.status(200).json({
      status: "success",
      data: final,
    });
  }
);

exports.banManager = errIdentifier.catchAsync(async (req, res, next) => {
  const manager = await Manager.findByIdAndUpdate(
    req.params.id,
    { banned: true, isApproved: false },
    { new: true, validateBeforeSave: false }
  ).select("name avatar isApproved");
  if (!manager)
    return errIdentifier.generateError(next, "Manager doesn't exists!!", 404);

  res.status(200).json({
    status: "success",
    data: manager,
  });
});

exports.getBannedManagers = errIdentifier.catchAsync(async (req, res, next) => {
  const bannedManagers = await Manager.aggregate([
    { $match: { isApproved: false, banned: true } },
    { $sort: { updatedAt: 1 } },
    { $project: { name: 1, avatar: 1, isApproved: 1 } },
  ]);
  res.status(200).json({
    status: "success",
    data: bannedManagers,
  });
});

exports.unBanManager = errIdentifier.catchAsync(async (req, res, next) => {
  const unBanManager = await Manager.findByIdAndUpdate(
    req.params.id,
    { isApproved: true, banned: false },
    {
      new: true,
      validateBeforeSave: false,
    }
  );
  if (!unBanManager)
    return errIdentifier.generateError(next, "Manager doesn't exists!!", 404);

  res.status(200).json({
    status: "success",
    data: unBanManager,
  });
});
