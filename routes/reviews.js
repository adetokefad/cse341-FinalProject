const express = require("express");
const reviewsController = require("../controllers/reviews");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

// Public GET routes
router.get("/", reviewsController.getAllReviews);
router.get("/:id", reviewsController.getReviewById);

// Protected write routes
router.post("/", isAuthenticated, reviewsController.createReview);
router.put("/:id", isAuthenticated, reviewsController.updateReview);
router.delete("/:id", isAuthenticated, reviewsController.deleteReview);

module.exports = router;
