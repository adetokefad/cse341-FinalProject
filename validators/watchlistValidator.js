const Joi = require("joi");

const userSchema = Joi.object({
  displayName: Joi.string().trim().required(),
  email: Joi.string().email().required(),
});

module.exports = userSchema;
