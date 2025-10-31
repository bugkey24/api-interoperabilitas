// Import modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import database connection
const db = require("./database.js");

// Import routes
const movieRoutes = require("./routes/movie.routes.js");
const directorRoutes = require("./routes/director.routes.js");
const authRoutes = require("./routes/auth.routes.js");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Define the port
const PORT = process.env.PORT || 3000;

// Main route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Film Management API (SQLite)" });
});

// Use the separated routes
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/directors", directorRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
