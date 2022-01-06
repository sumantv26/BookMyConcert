const Joi = require("joi");

exports.validateSignup = (req, res, next) => {
  const user = req.body;
  const now = Date.now();
  // 18 years ago date
  const cutOffDate = new Date(now - 1000 * 60 * 60 * 24 * 365 * 18);

  const commonSchema = {
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(15).required(),
    passwordConfirmation: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .options({ messages: { "any.only": "{{#label}} does not match" } }),
    birthDate: Joi.date().max(cutOffDate).required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    role: Joi.string().valid("user", "manager", "admin").required(),
  };

  const managerSchema = {
    ...commonSchema,
    contactNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    creditCardNum: Joi.string().length(16).required(),
    isApproved: Joi.boolean().default(false),
  };

  let validationSchema;
  if (user.role === "manager")
    validationSchema = Joi.object({ ...managerSchema });
  else validationSchema = Joi.object({ ...commonSchema });

  const { error } = validationSchema.validate(user);
  if (error) return res.status(400).send(error.message);

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
