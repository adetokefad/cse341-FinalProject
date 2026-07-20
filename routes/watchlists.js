const express = require("express");
const router = express.Router();
const watchlistsController = require("../controllers/watchlists");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", isAuthenticated, watchlistsController.getAllWatchlists);
router.get("/:id", isAuthenticated, watchlistsController.getWatchlistById);
router.post("/", isAuthenticated, watchlistsController.createWatchlist);
router.put("/:id", isAuthenticated, watchlistsController.updateWatchlist);
router.delete("/:id", isAuthenticated, watchlistsController.deleteWatchlist);

module.exports = router;
