const validateObjectId = require("../utils/validateObjectId");
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
    const { error, value } = watchlistSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    const db = getDB();

    const result = await db.collection("watchlists").insertOne({
      ...value,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Watchlist created successfully",
      id: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating watchlist",
      error: err.message,
    });
  }
};

const updateWatchlist = async (req, res) => {
  // #swagger.summary = 'Update a watchlist'
  // #swagger.description = 'Updates an existing watchlist by ID'
  try {
    const { error, value } = watchlistSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    const db = getDB();

    const result = await db.collection("watchlists").replaceOne(
      { _id: new ObjectId(req.params.id) },
      {
        ...value,
        updatedAt: new Date(),
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Watchlist not found",
      });
    }

    res.status(200).json({
      message: "Watchlist updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating watchlist",
      error: err.message,
    });
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
