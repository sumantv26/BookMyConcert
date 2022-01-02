const multer = require("multer");
const Manager = require("../models/Manager");

exports.getMulterForAvatar = () => {
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + "/../images/");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `${req.user.role}-${req.user._id}-${file.fieldname}.${ext}`);
    },
  });
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "png") cb(null, true);
    else cb(new Error("Not a PNG file"), false);
  };
  return multer({ storage: multerStorage });
};

exports.getUserById = async (req, res, next) => {
  const Model = req.user.Model;
  try {
    const manager = await Model.findById(req.query.id).select("-password");
    if (!manager) return res.status(404).send("User Not Found.");
    res.status(200).send(manager);
  } catch (ex) {
    console.log(ex.message);
    res.status(400).send("Invalid Argument");
  }
};

exports.getOwnData = async (req, res, next) => {
  const Model = req.user.Model;
  const manager = await Model.findById(req.user._id).select("-password -__v");
  res.status(200).send(manager);
};

exports.updateUserData = async (req, res, next) => {
  const Model = req.user.Model;

  const data = JSON.parse(JSON.stringify(req.body));
  if (!data) return res.status(400).send("No data Provided.");
  if (req.file != undefined) data.avatar = req.file.filename;
  const response = await Model.updateOne({ email: req.user.email }, data);
  if (response.matchedCount < 1)
    return res.status(400).send("can't update data try again leter");
  res.status(200).send("updated successfully");
};
