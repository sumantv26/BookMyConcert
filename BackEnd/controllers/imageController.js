const multer = require("multer");
const sharp = require("sharp");
const errIdentifier = require("../utils/errIdentifier");
const getModel = require("../utils/getModel");

const imageTypes = {
  avatar: { width: 500, height: 500 },
  coverImage: { width: 1920, height: 1080 },
  optionalImages: { width: 720, height: 720 },
};

const multerStorage = multer.memoryStorage();
const filterImageFiles = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else errIdentifier.generateError(cb, "Please Upload Only Images", 400, true);
};

exports.upload = multer({
  storage: multerStorage,
  fileFilter: filterImageFiles,
});

const resize = async (file) => {
  const folder = file.fieldname === "avatar" ? "users" : "concerts";
  await sharp(file.buffer)
    .resize(imageTypes[file.fieldname].width, imageTypes[file.fieldname].height)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/${folder}/${file.filename}`);
};

const renameResize = async (req) => {
  if (req.file) {
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await resize(req.file);
  } else if (req.files) {
    for (const key in req.files) {
      if (Object.prototype.hasOwnProperty.call(req.files, key)) {
        req.files[key].forEach(async (img, idx) => {
          img.filename = `${key}-${req.user.id}-${idx}-${Date.now()}.jpeg`;
          await resize(img);
        });
      }
    }
  }
};

exports.configureImages = errIdentifier.catchAsync(async (req, _, next) => {
  if (!req.file && !req.files) return next();
  await renameResize(req);
  next();
});

// exports.deletePrevious = errIdentifier.catchAsync(async (req, _, next) => {
//   if (!req.file && !req.files) return next();
//   if (req.file) {
//     const Model = getModel(req.user.role);
//     const user = await Model.findById(req.user.id);
//     const fileName = user.avatar;
//     console.log(fileName);
//   }
// });
