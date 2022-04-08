const multer = require("multer");

const errIdentifier = require("../utils/errIdentifier");

module.exports = class newImage {
  constructor(imageType) {
    this.imageType = imageType;
    if (imageType === "profilePhoto") this.width = this.height = 500;
    else if (imageType === "coverImage") {
      this.width = 820;
      this.height = 360;
    }
  }

  static multerStorage = multer.memoryStorage();
  static filterImageFiles(req, file, cb) {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else
      errIdentifier.generateError(cb, "Please Upload Only Images", 400, true);
  }

  upload = multer({
    storage: newImage.multerStorage,
    fileFilter: newImage.filterImageFiles,
  });

  renameResize = async () => {};

  configureImages() {
    return async (req, _, next) => {
      // console.log(req.body);
      if (!req.file && !req.files) return next();

      // console.log(this);
      // console.log(req.file);
    };
  }
};
