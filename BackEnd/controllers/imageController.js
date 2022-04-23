const multer = require("multer");
const sharp = require("sharp");
const errIdentifier = require("../utils/errIdentifier");

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
    req.file.filename = `user-${req.user.id}.jpeg`;
    await resize(req.file);
  } else if (req.files) {
    if (req.files?.index) {
      req.files.optionalImages[0].filename = `${
        req.files.optionalImages[0].fieldname
      }-${req.user.id}-${req.files.index}-${Date.now()}.jpeg`;
      await resize(req.files.optionalImages[0]);
    } else {
      for (const key in req.files) {
        if (Object.prototype.hasOwnProperty.call(req.files, key)) {
          req.files[key].forEach(async (file, idx) => {
            file.filename = `${key}-${req.user.id}-${idx}-${Date.now()}.jpeg`;
            await resize(file);
          });
        }
      }
    }
  }
};

const nameFromPrev = (file, prevName) => {
  const prevDate = prevName.split("-").pop();
  const newDate = `${Date.now()}.jpeg`;
  const newName = prevName.replace(prevDate, newDate);
  file.filename = newName;
};

exports.configureImages = errIdentifier.catchAsync(async (req, _, next) => {
  if (!req.file && !req.files) return next();
  if (req.params?.imgName) {
    const key = Object.keys(req.files)[0];
    nameFromPrev(req.files[key][0], req.params?.imgName);
    resize(req.files[key][0]);
  } else await renameResize(req);
  next();
});

// exports.deleteImages = errIdentifier.catchAsync(async (req, res, next) => {
//   console.log("hello");
//   let filePath = "";
//   let fileName = "";
//   if (req.params?.imgName) {
//     fileName = req.params?.imgName;
//     filePath = `${__dirname}/../public/img/concerts`;
//     const files = await fs.promises.readdir(filePath);
//     for (const file of files) {
//       console.log(file);
//     }
//   } else {
//     if (!(req.user?.avatar === "default.jpeg")) {
//       fileName = `user-${req.user.id}.jpeg`;
//       filePath = `${__dirname}/../public/img/users`;
//       const files = await fs.promises.readdir(filePath);
//       for (const file of files) {
//         if (file === fileName)
//           await fs.unlink(`${filePath}/${file}`, (err) => {
//             if (err) throw err;
//           });
//       }
//     }
//   }
//   res.status(204).json({
//     status: "success",
//   });
// });
