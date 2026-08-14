const validateObjectId = require("../utils/validateObjectId");
const { getDB } = require("../db/connection");
const movieSchema = require("../validators/movieValidator");
const { ObjectId } = require("mongodb");

const getAllMovies = async (req, res) => {
  // #swagger.summary = 'Get all movies'
  // #swagger.description = 'Returns a list of all movies in the database'
  try {
    const db = getDB();
    const movies = await db.collection("movies").find().toArray();
    res.status(200).json(movies);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving movies", error: err.message });
  }
};

const getMovieById = async (req, res) => {
  // #swagger.summary = 'Get a single movie'
  // #swagger.description = 'Returns a single movie by ID'
  try {
    const db = getDB();
    const movie = await db.collection("movies").findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json(movie);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving movie", error: err.message });
  }
};

const createMovie = async (req, res) => {
  // #swagger.summary = 'Create a new movie'
  // #swagger.description = 'Creates a new movie in the database'
  try {
    const { error, value } = movieSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    const db = getDB();

    const result = await db.collection("movies").insertOne({
      ...value,
    });

    res.status(201).json({
      message: "Movie created successfully",
      id: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating movie",
      error: err.message,
    });
  }
};

const updateMovie = async (req, res) => {
  // #swagger.summary = 'Update a movie'
  // #swagger.description = 'Updates an existing movie by ID'
  try {
    const { error, value } = movieSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    const db = getDB();

    const result = await db.collection("movies").replaceOne(
      { _id: new ObjectId(req.params.id) },
      {
        ...value,
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.status(200).json({
      message: "Movie updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating movie",
      error: err.message,
    });
  }
};

const deleteMovie = async (req, res) => {
  // #swagger.summary = 'Delete a movie'
  // #swagger.description = 'Deletes a movie by ID'
  try {
    const db = getDB();
    const result = await db.collection("movies").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Movie not found" });
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting movie", error: err.message });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
