const Joi = require("joi");

const movieSchema = Joi.object({
  title: Joi.string().trim().required(),
  genre: Joi.string().trim().required(),
  director: Joi.string().trim().required(),
  releaseYear: Joi.number().integer().min(1888).max(2100).required(),
  runtime: Joi.number().integer().positive().required(),
  language: Joi.string().trim().required(),
  synopsis: Joi.string().trim().required(),
  posterUrl: Joi.string().uri().required(),
});

module.exports = movieSchema;
