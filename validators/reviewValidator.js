const Joi = require("joi");

const reviewSchema = Joi.object({
  movieId: Joi.string().required(),
  userId: Joi.string().required(),
  rating: Joi.number().min(1).max(10).required(),
  reviewText: Joi.string().trim().required(),
});

module.exports = reviewSchema;
