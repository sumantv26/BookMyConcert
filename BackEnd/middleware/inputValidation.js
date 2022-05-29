const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
// const lodash = require("lodash");
// const util = require("util");

const Cities = require("../models/ConcertModels/Cities");
const getModel = require("../utils/getModel");
const errIdentifier = require("../utils/errIdentifier");

const get18Years = () => {
  return new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18);
};

const userValidation = {
  name: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).max(30).required(),
  passwordConfirmation: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .options({ messages: { "any.only": "{{#label}} does not match" } }),
  birthDate: Joi.date().max(get18Years()).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  role: Joi.string().valid("customer", "manager", "admin").required(),
  contactNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  bankName: Joi.string().required(),
  accountNum: Joi.number().min(9).max(18),
  ifscCode: Joi.string().length(11).required(),
  isApproved: Joi.boolean().default(false),
  banned: Joi.boolean().default(false),
};

const commonSchema = {
  name: userValidation.name,
  email: userValidation.email,
  password: userValidation.password,
  passwordConfirmation: userValidation.passwordConfirmation,
  birthDate: userValidation.birthDate,
  gender: userValidation.gender,
  role: userValidation.role,
};

const managerSchema = {
  ...commonSchema,
  contactNumber: userValidation.contactNumber,
  bankName: userValidation.bankName,
  accountNum: userValidation.accountNum,
  ifscCode: userValidation.ifscCode,
  isApproved: userValidation.isApproved,
  banned: userValidation.banned,
};

const validateHandler = (schema, toValidate, next) => {
  const { error } = schema.validate(toValidate);
  if (error) {
    error.statusCode = 400;
    return next(error);
  }
  next();
};

exports.signupIp = (req, _, next) => {
  let validationSchema;
  if (req.body.role === "manager")
    validationSchema = Joi.object({ ...managerSchema });
  else validationSchema = Joi.object({ ...commonSchema });

  validateHandler(validationSchema, req.body, next);
};

exports.loginIp = (req, _, next) => {
  const user = req.body;
  // console.log(user);
  const loginSchema = Joi.object({
    email: userValidation.email,
    password: userValidation.password,
  });
  validateHandler(loginSchema, user, next);
};

exports.emailIp = (req, _, next) => {
  const validationSchema = Joi.object({ email: userValidation.email });
  validateHandler(validationSchema, req.body, next);
};

const immutableUserProps = ["_id", "password", "role", "email", "__v"];

exports.userUpdateIp = (req, _, next) => {
  const Model = getModel(req.user.role);
  const keys = Object.keys(Model.schema.paths);
  const ipKeys = Object.keys(req.body);
  const userSchema = {};
  for (const key of ipKeys) {
    if (immutableUserProps.includes(key) || !keys.includes(key)) continue;
    userSchema[key] = userValidation[key];
  }
  const validationSchema = Joi.object({ ...userSchema });
  validateHandler(validationSchema, req.body, next);
};

const concertSchema = {
  name: Joi.string().min(7).max(30).required(),
  description: Joi.string().min(10).max(200).required(),
  artist: Joi.array().items(Joi.string().required()).max(3),
  timing: Joi.object({
    from: Joi.date().greater("now").required(),
    to: Joi.date().greater(Joi.ref("from")).required(),
  }),
  venue: Joi.object({
    coordinates: Joi.object({
      type: Joi.string().valid("Point").required(),
      longitude: Joi.number().min(-180).max(180).required(),
      latitude: Joi.number().min(-90).max(90).required(),
    }),
    address: Joi.string().min(10).max(200),
    city: Joi.string().max(45).required(),
  }),
  tags: Joi.array().items(Joi.string().required()).max(3),
  price: Joi.number().integer().min(200).positive().required(),
  totalSlots: Joi.number().required(),
  postedBy: Joi.objectId().required(),
};

exports.concertIp = errIdentifier.catchAsync(async (req, _, next) => {
  if (!req.body?.venue?.city)
    return errIdentifier.generateError(next, "City must be provided", 400);

  req.body.venue.city = req.body?.venue?.city.toLowerCase();
  const city = await Cities.findOne({ name: req.body.venue.city });
  if (!city)
    return errIdentifier.generateError(
      next,
      "Please, select city from the options below",
      400
    );

  req.body.timing.from = new Date(req.body.timing.from);
  req.body.timing.to = new Date(req.body.timing.to);
  req.body.postedBy = req.user.id;
  req.body.venue.coordinates = city.coordinates;

  const validationSchema = Joi.object({ ...concertSchema });
  validateHandler(validationSchema, req.body, next);
});

const unUpdatedFields = ["_id", "postedBy", "avgRating", "noOfRatings", "__v"];

exports.concertUpdateIp = (req, _, next) => {
  const keys = Object.keys(concertSchema);
  const ipKeys = Object.keys(req.body);
  const updatedSchema = {};
  for (const key of ipKeys) {
    if (unUpdatedFields.includes(key) || !keys.includes(key)) {
      delete req.body[key];
      continue;
    }
    updatedSchema[key] = concertSchema[key];
  }
  const validationSchema = Joi.object({ ...updatedSchema });
  validateHandler(validationSchema, req.body, next);
};

exports.reportIp = (req, _, next) => {
  const validationSchema = Joi.object({ reasonId: Joi.objectId().required() });
  validateHandler(validationSchema, req.body, next);
};

exports.passwordIp = (req, _, next) => {
  const validationSchema = Joi.object({
    password: userValidation.password,
    passwordConfirmation: userValidation.passwordConfirmation,
  });
  validateHandler(validationSchema, req.body, next);
};

const reviewSchema = {
  rating: Joi.number().min(1).max(5),
  review: Joi.string().max(300).trim(),
};

exports.reviewIp = (req, _, next) => {
  const schema = { rating: reviewSchema.rating };
  if (req.body.review) {
    req.body.review = req.body.review.trim();
    schema["review"] = reviewSchema.review;
  }
  const validationSchema = Joi.object({ ...schema });
  validateHandler(validationSchema, req.body, next);
};

exports.reviewUpdateIp = (req, _, next) => {
  const updatedSchema = {};
  if (req.body.rating) updatedSchema["rating"] = reviewSchema.rating;
  if (req.body.review) updatedSchema["review"] = reviewSchema.review;
  const validationSchema = Joi.object({ ...updatedSchema });
  validateHandler(validationSchema, req.body, next);
};
