const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller.js");
const authenticateToken = require("../middleware/authMiddleware.js");

// Routes for Movies
router.get("/", movieController.getAllMovies);
router.get("/:id", movieController.getMovieById);

// PROTECTED ROUTES
router.post("/", authenticateToken, movieController.createMovie);
router.put("/:id", authenticateToken, movieController.updateMovie);
router.delete("/:id", authenticateToken, movieController.deleteMovie);

module.exports = router;
