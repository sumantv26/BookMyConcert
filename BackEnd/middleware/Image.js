const multer = require("multer");
const sharp = require("sharp");
module.exports = class Image {
  constructor(imageType) {
    this.imageType = imageType;
    if (imageType === "userPhoto") this.width = this.height = 500;
    else if (imageType === "coverImage") {
      this.width = 820;
      this.height = 360;
    }
  }
  static multerStorage = multer.memoryStorage();

  static filterImageFiles(req, file, cb) {
    // if (file.mimetype.startsWith("image")) cb(null, true);
    // else
    //   errIdentifier.generateError(cb, "Please Upload Only Images", 400, true);
  }

  static upload = multer({
    storage: Image.multerStorage,
    fileFilter: Image.filterImageFiles,
  });

  static async renameResize(file, img) {
    // const prefix = img.width === img.height ? "user" : "concert";
    // file.filename = `${prefix}-${req.user.id}-${Date.now()}.jpeg`;
    // await sharp(file.buffer)
    //   .resize(img.width, img.height)
    //   .toFormat("jpeg")
    //   .jpeg({ quality: 90 })
    //   .toFile(`public/img/${prefix}/${req.file.filename}`);
  }

  static configureImages(img) {
    return async (req, _, next) => {
      if (!req.file && !req.files) return next();

      // const prefix = img.width === img.height ? "user" : "concert";
      if (img.imageType === "userPhoto") {
        // renameResize(req.file, img);
        // console.log(req.file);
        // req.file.filename = `${prefix}-${req.user.id}-${Date.now()}.jpeg`;
        // await sharp(req.file.buffer)
        //   .resize(img.width, img.height)
        //   .toFormat("jpeg")
        //   .jpeg({ quality: 90 })
        //   .toFile(`public/img/users/${req.file.filename}`);
      } else if (img.imageType === "coverImage") {
        console.log(req.files.coverImage);
      }
      next();
    };
  }

  // static async resizeProfilePhotos(req, res, next) {
  //   if (!req.file) return next();

  //   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  //   await sharp(req.file.buffer)
  //     .resize(this.width, this.height)
  //     .toFormat("jpeg")
  //     .jpeg({ quality: 90 })
  //     .toFile(`public/img/users/${req.file.filename}`);
  //   next();
  // }
};
