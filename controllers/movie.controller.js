const db = require("../database.js");

// GET all movies
exports.getAllMovies = (req, res) => {
  const sql = "SELECT * FROM movies";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: "Success",
      data: rows,
    });
  });
};

// GET movie by ID
exports.getMovieById = (req, res) => {
  const sql = "SELECT * FROM movies WHERE id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json({
      message: "Success",
      data: row,
    });
  });
};

// POST new movie
exports.createMovie = (req, res) => {
  const { title, year, director_id } = req.body;
  if (!title || !year) {
    return res
      .status(400)
      .json({ error: "Fields 'title' and 'year' are required" });
  }

  const sql = "INSERT INTO movies (title, year, director_id) VALUES (?,?,?)";
  const params = [title, year, director_id || null];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: "Movie created successfully",
      data: { id: this.lastID, title, year, director_id },
    });
  });
};

// PUT update movie
exports.updateMovie = (req, res) => {
  const { title, year, director_id } = req.body;
  const sql = `UPDATE movies SET 
                   title = COALESCE(?, title), 
                   year = COALESCE(?, year), 
                   director_id = COALESCE(?, director_id) 
                 WHERE id = ?`;
  const params = [title, year, director_id, req.params.id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json({
      message: `Movie ${req.params.id} updated successfully`,
      changes: this.changes,
    });
  });
};

// DELETE movie
exports.deleteMovie = (req, res) => {
  const sql = "DELETE FROM movies WHERE id = ?";
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json({
      message: `Movie ${req.params.id} deleted successfully`,
      changes: this.changes,
    });
  });
};
