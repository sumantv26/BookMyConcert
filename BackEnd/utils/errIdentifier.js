const AppError = require("./AppError");

exports.catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};

exports.generateError = (next, msg, code, fromMulter = false) => {
  if (fromMulter) return next(new AppError(msg, code), false);
  return next(new AppError(msg, code));
};
