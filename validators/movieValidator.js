const Joi = require("joi");

const movieSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  rating: Joi.number().optional(),
});

module.exports = movieSchema;
