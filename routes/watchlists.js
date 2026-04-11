const express = require("express");
const router = express.Router();
const watchlistsController = require("../controllers/watchlists");

// Temporarily unprotected to populate database
router.get("/", watchlistsController.getAllWatchlists);
router.get("/:id", watchlistsController.getWatchlistById);
router.post("/", watchlistsController.createWatchlist);
router.put("/:id", watchlistsController.updateWatchlist);
router.delete("/:id", watchlistsController.deleteWatchlist);

module.exports = router;
