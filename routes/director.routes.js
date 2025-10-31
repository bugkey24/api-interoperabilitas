const express = require("express");
const router = express.Router();
const directorController = require("../controllers/director.controller.js");
const authenticateToken = require("../middleware/authMiddleware.js");

// Routes for Directors
router.get("/", directorController.getAllDirectors);
router.get("/:id", directorController.getDirectorById);

// PROTECTED ROUTES
router.post("/", authenticateToken, directorController.createDirector);
router.put("/:id", authenticateToken, directorController.updateDirector);
router.delete("/:id", authenticateToken, directorController.deleteDirector);

module.exports = router;
