const { getDB } = require("../db/connection");
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
    const {
      title,
      genre,
      director,
      releaseYear,
      runtime,
      language,
      synopsis,
      posterUrl,
    } = req.body;

    if (
      !title ||
      !genre ||
      !director ||
      !releaseYear ||
      !runtime ||
      !language ||
      !synopsis ||
      !posterUrl
    ) {
      return res
        .status(400)
        .json({
          message:
            "All fields are required: title, genre, director, releaseYear, runtime, language, synopsis, posterUrl",
        });
    }

    const db = getDB();
    const result = await db.collection("movies").insertOne({
      title,
      genre,
      director,
      releaseYear,
      runtime,
      language,
      synopsis,
      posterUrl,
    });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating movie", error: err.message });
  }
};

const updateMovie = async (req, res) => {
  // #swagger.summary = 'Update a movie'
  // #swagger.description = 'Updates an existing movie by ID'
  try {
    const {
      title,
      genre,
      director,
      releaseYear,
      runtime,
      language,
      synopsis,
      posterUrl,
    } = req.body;

    if (
      !title ||
      !genre ||
      !director ||
      !releaseYear ||
      !runtime ||
      !language ||
      !synopsis ||
      !posterUrl
    ) {
      return res
        .status(400)
        .json({
          message:
            "All fields are required: title, genre, director, releaseYear, runtime, language, synopsis, posterUrl",
        });
    }

    const db = getDB();
    const result = await db
      .collection("movies")
      .replaceOne(
        { _id: new ObjectId(req.params.id) },
        {
          title,
          genre,
          director,
          releaseYear,
          runtime,
          language,
          synopsis,
          posterUrl,
        },
      );
    if (result.modifiedCount === 0)
      return res.status(404).json({ message: "Movie not found" });
    res.status(204).send();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating movie", error: err.message });
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
