const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/movies");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", moviesController.getAllMovies);
router.get("/:id", moviesController.getMovieById);
router.post("/", isAuthenticated, moviesController.createMovie);
router.put("/:id", isAuthenticated, moviesController.updateMovie);
router.delete("/:id", isAuthenticated, moviesController.deleteMovie);

module.exports = router;
