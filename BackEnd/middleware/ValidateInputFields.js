const Joi = require("joi");
// module.exports = (req, res, next) => {
//   const schema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().min(3).max(15).required(),
//     role: Joi.string().valid("user", "customer manager", "admin"),
//   });
//   const { error } = schema.validate(req.body);
//   if (error) return res.status(400).send(error.message);

//   next();
// };
const validateManager = (data) => {
  const managerSchema = Joi.object({
    // contactNumber: Joi.string()
    //   .length(10)
    //   .pattern(/^[0-9]+$/)
    //   .required(),
    // creditCardNum: Joi.string().length(16).required(),
    // isApproved: Joi.boolean().default(false),
  }).options({ allowUnknown: true });
  return managerSchema.validate(data);
};

exports.validateSignup = (req, res, next) => {
  const user = req.body;
  const now = Date.now();
  // 18 years ago date
  const cutOffDate = new Date(now - 1000 * 60 * 60 * 24 * 365 * 18);

  const commonSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(15).required(),
    // birthDate: Joi.date().max(cutOffDate).required(),
    // gender: Joi.string().valid("male", "female", "other"),
    role: Joi.string().valid("customer", "manager", "admin").required(),
  }).options({ allowUnknown: true });

  const { error } = commonSchema.validate(user);
  if (error) return res.status(400).send(error.message);

  if (user.role === "manager") {
    const { error } = validateManager(user);
    if (error) return res.status(400).send(error.message);
  }

  // if (!schema.validate(customer)) {
  //   const { error } = validate(data);
  //   if (error) return res.status(400).send(error.message);
  // }
  next();
};

exports.validateLogin = (req, res, next) => {
  const user = req.body;
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(15).required(),
  });

  const { error } = loginSchema.validate(user);
  if (error) return res.status(400).send(error.message);
  next();
};
