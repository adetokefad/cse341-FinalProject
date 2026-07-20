const { getDB } = require("../db/connection");
const watchlistSchema = require("../validators/watchlistValidator");
const { ObjectId } = require("mongodb");

const getAllWatchlists = async (req, res) => {
  // #swagger.summary = 'Get all watchlists'
  // #swagger.description = 'Returns all watchlists for the current user'
  try {
    const db = getDB();
    const watchlists = await db.collection("watchlists").find().toArray();
    res.status(200).json(watchlists);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving watchlists", error: err.message });
  }
};

const getWatchlistById = async (req, res) => {
  // #swagger.summary = 'Get a single watchlist'
  // #swagger.description = 'Returns a single watchlist by ID'
  try {
    const db = getDB();
    const watchlist = await db.collection("watchlists").findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!watchlist)
      return res.status(404).json({ message: "Watchlist not found" });
    res.status(200).json(watchlist);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving watchlist", error: err.message });
  }
};

const createWatchlist = async (req, res) => {
  // #swagger.summary = 'Create a new watchlist'
  // #swagger.description = 'Creates a new watchlist in the database'
  try {
    const { name, userId, movieIds } = req.body;

    if (!name || !userId || !movieIds) {
      return res
        .status(400)
        .json({ message: "All fields are required: name, userId, movieIds" });
    }

    if (!Array.isArray(movieIds)) {
      return res.status(400).json({ message: "movieIds must be an array" });
    }

    const db = getDB();
    const result = await db.collection("watchlists").insertOne({
      name,
      userId,
      movieIds,
      createdAt: new Date(),
    });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating watchlist", error: err.message });
  }
};

const updateWatchlist = async (req, res) => {
  // #swagger.summary = 'Update a watchlist'
  // #swagger.description = 'Updates an existing watchlist by ID'
  try {
    const { name, userId, movieIds } = req.body;

    if (!name || !userId || !movieIds) {
      return res
        .status(400)
        .json({ message: "All fields are required: name, userId, movieIds" });
    }

    if (!Array.isArray(movieIds)) {
      return res.status(400).json({ message: "movieIds must be an array" });
    }

    const db = getDB();
    const result = await db
      .collection("watchlists")
      .replaceOne(
        { _id: new ObjectId(req.params.id) },
        { name, userId, movieIds, updatedAt: new Date() },
      );
    if (result.modifiedCount === 0)
      return res.status(404).json({ message: "Watchlist not found" });
    res.status(204).send();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating watchlist", error: err.message });
  }
};

const deleteWatchlist = async (req, res) => {
  // #swagger.summary = 'Delete a watchlist'
  // #swagger.description = 'Deletes a watchlist by ID'
  try {
    const db = getDB();
    const result = await db.collection("watchlists").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Watchlist not found" });
    res.status(200).json({ message: "Watchlist deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting watchlist", error: err.message });
  }
};

module.exports = {
  getAllWatchlists,
  getWatchlistById,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
};
