const Joi = require("joi");

const watchlistSchema = Joi.object({
  userId: Joi.string().required(),
  movies: Joi.array().items(Joi.string()).required(),
});

module.exports = watchlistSchema;
