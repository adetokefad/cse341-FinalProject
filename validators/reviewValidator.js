const Joi = require("joi");

const reviewSchema = Joi.object({
  movieId: Joi.string().required(),
  comment: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
});

module.exports = reviewSchema;
