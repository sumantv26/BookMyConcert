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
exports.validateCustomer = (req, res, next) => {
  const customer = req.body;
  const now = Date.now();
  // 18 years ago date
  const cutOffDate = new Date(now - 1000 * 60 * 60 * 24 * 365 * 18);

  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(15).required(),
    password_confirmation: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .options({ messages: { "any.only": "{{#label}} does not match" } }),
    birthDate: Joi.date().max(cutOffDate).required(),
    gender: Joi.string().valid("male", "female", "other"),
    role: Joi.string().valid("user").required(),
  });
  if (!schema.validate(customer)) {
    const { error } = validate(data);
    if (error) return res.status(400).send(error.message);
  }
  next();
};
