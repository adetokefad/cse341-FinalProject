const { getDB } = require("../db/connection");
const reviewSchema = require("../validators/reviewValidator");
const { ObjectId } = require("mongodb");

const getAllReviews = async (req, res) => {
  // #swagger.summary = 'Get all reviews'
  // #swagger.description = 'Returns a list of all reviews in the database'
  try {
    const db = getDB();
    const reviews = await db.collection("reviews").find().toArray();
    res.status(200).json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving reviews", error: err.message });
  }
};

const getReviewById = async (req, res) => {
  // #swagger.summary = 'Get a single review'
  // #swagger.description = 'Returns a single review by ID'
  try {
    const db = getDB();
    const review = await db.collection("reviews").findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json(review);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving review", error: err.message });
  }
};

const createReview = async (req, res) => {
  // #swagger.summary = 'Create a new review'
  // #swagger.description = 'Creates a new review in the database'
  try {
    const { movieId, userId, rating, reviewText } = req.body;

    if (!movieId || !userId || !rating || !reviewText) {
      return res.status(400).json({
        message: "All fields are required: movieId, userId, rating, reviewText",
      });
    }

    if (rating < 1 || rating > 10) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 10" });
    }

    const db = getDB();
    const result = await db.collection("reviews").insertOne({
      movieId,
      userId,
      rating,
      reviewText,
      createdAt: new Date(),
    });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating review", error: err.message });
  }
};

const updateReview = async (req, res) => {
  // #swagger.summary = 'Update a review'
  // #swagger.description = 'Updates an existing review by ID'
  try {
    const { movieId, userId, rating, reviewText } = req.body;

    if (!movieId || !userId || !rating || !reviewText) {
      return res.status(400).json({
        message: "All fields are required: movieId, userId, rating, reviewText",
      });
    }

    if (rating < 1 || rating > 10) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 10" });
    }

    const db = getDB();
    const result = await db
      .collection("reviews")
      .replaceOne(
        { _id: new ObjectId(req.params.id) },
        { movieId, userId, rating, reviewText, updatedAt: new Date() },
      );
    if (result.modifiedCount === 0)
      return res.status(404).json({ message: "Review not found" });
    res.status(204).send();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating review", error: err.message });
  }
};

const deleteReview = async (req, res) => {
  // #swagger.summary = 'Delete a review'
  // #swagger.description = 'Deletes a review by ID'
  try {
    const db = getDB();
    const result = await db.collection("reviews").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: err.message });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
