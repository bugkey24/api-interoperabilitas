const db = require("../db.js");

// GET all directors
exports.getAllDirectors = (req, res) => {
  const sql = "SELECT * FROM directors";
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

// GET director by ID
exports.getDirectorById = (req, res) => {
  const sql = "SELECT * FROM directors WHERE id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Director not found" });
    }
    res.json({
      message: "Success",
      data: row,
    });
  });
};

// POST new director
exports.createDirector = (req, res) => {
  const { name, birth_year } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Field 'name' is required" });
  }

  const sql = "INSERT INTO directors (name, birth_year) VALUES (?,?)";
  const params = [name, birth_year || null];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: "Director created successfully",
      data: { id: this.lastID, name, birth_year },
    });
  });
};

// PUT update director
exports.updateDirector = (req, res) => {
  const { name, birth_year } = req.body;
  const sql = `UPDATE directors SET 
                   name = COALESCE(?, name), 
                   birth_year = COALESCE(?, birth_year) 
                 WHERE id = ?`;
  const params = [name, birth_year, req.params.id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Director not found" });
    }
    res.json({
      message: `Director ${req.params.id} updated successfully`,
      changes: this.changes,
    });
  });
};

// DELETE director
exports.deleteDirector = (req, res) => {
  const sql = "DELETE FROM directors WHERE id = ?";
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Director not found" });
    }
    res.json({
      message: `Director ${req.params.id} deleted successfully`,
      changes: this.changes,
    });
  });
};
