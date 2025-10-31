// Import dotenv to load environment variables
require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();

// Get the database file name from .env
const DB_SOURCE = process.env.DB_SOURCE;

// Create the database connection
const db = new sqlite3.Database(DB_SOURCE, (err) => {
  if (err) {
    // Failed to connect
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");

    // db.serialize() ensures commands run in sequence
    db.serialize(() => {
      // Create the 'movies' table
      db.run(
        `CREATE TABLE IF NOT EXISTS movies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                year INTEGER,
                director_id INTEGER,
                FOREIGN KEY (director_id) REFERENCES directors (id) ON DELETE SET NULL
                UNIQUE(title, year)
            )`,
        (err) => {
          if (err) {
            console.error("Error creating 'movies' table:", err.message);
          } else {
            console.log("Table 'movies' is ready.");
          }
        }
      );

      // Create the 'directors' table
      db.run(
        `CREATE TABLE IF NOT EXISTS directors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                birth_year INTEGER
            )`,
        (err) => {
          if (err) {
            console.error("Error creating 'directors' table:", err.message);
          } else {
            console.log("Table 'directors' is ready.");
          }
        }
      );

      // Create the 'users' table
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )`,
        (err) => {
          if (err) {
            console.error("Error creating 'users' table:", err.message);
          } else {
            console.log("Table 'users' is ready.");
          }
        }
      );
    });
  }
});

// Export the database to be used in other files
module.exports = db;
