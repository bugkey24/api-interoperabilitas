require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken, authorizeRole } = require("./middleware/auth.js");

const app = express();
const PORT = process.env.PORT || 3300;
const JWT_SECRET = process.env.JWT_SECRET;

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());

// === STATUS ROUTE ===
app.get("/status", (req, res) => {
  res.json({ ok: true, service: "film-api" });
});

// === AUTH ROUTES (Refactored for pg) ===
app.post("/auth/register", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Username and password (min 6 char) are required" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Use $1, $2, $3 and RETURNING to get the new ID/username
    const sql =
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username";
    const result = await db.query(sql, [
      username.toLowerCase(),
      hashedPassword,
      "user",
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      // PostgreSQL Unique Constraint Error
      return res.status(409).json({ error: "Username already in use" });
    }
    next(err);
  }
});

app.post("/auth/register-admin", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Username and password (min 6 char) are required" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const sql =
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username";
    const result = await db.query(sql, [
      username.toLowerCase(),
      hashedPassword,
      "admin",
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Username already in use" });
    }
    next(err);
  }
});

app.post("/auth/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const sql = "SELECT * FROM users WHERE username = $1";
    const result = await db.query(sql, [username.toLowerCase()]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = {
      user: { id: user.id, username: user.username, role: user.role },
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token: token });
  } catch (err) {
    next(err);
  }
});

// === MOVIE ROUTES ===
app.get("/movies", async (req, res, next) => {
  const sql = `
    SELECT m.id, m.title, m.year, d.id as director_id, d.name as director_name
    FROM movies m
    LEFT JOIN directors d ON m.director_id = d.id
    ORDER BY m.id ASC
  `;
  try {
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get("/movies/:id", async (req, res, next) => {
  const sql = `
    SELECT m.id, m.title, m.year, d.id as director_id, d.name as director_name
    FROM movies m
    LEFT JOIN directors d ON m.director_id = d.id
    WHERE m.id = $1
  `;
  try {
    const result = await db.query(sql, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post("/movies", authenticateToken, async (req, res, next) => {
  const { title, director_id, year } = req.body;
  if (!title || !director_id || !year) {
    return res
      .status(400)
      .json({ error: "title, director_id, and year are required" });
  }
  const sql =
    "INSERT INTO movies (title, director_id, year) VALUES ($1, $2, $3) RETURNING *";
  try {
    const result = await db.query(sql, [title, director_id, year]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.put(
  "/movies/:id",
  [authenticateToken, authorizeRole("admin")],
  async (req, res, next) => {
    const { title, director_id, year } = req.body;
    const sql =
      "UPDATE movies SET title = $1, director_id = $2, year = $3 WHERE id = $4 RETURNING *";
    try {
      const result = await db.query(sql, [
        title,
        director_id,
        year,
        req.params.id,
      ]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Movie not found" });
      }
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  "/movies/:id",
  [authenticateToken, authorizeRole("admin")],
  async (req, res, next) => {
    const sql = "DELETE FROM movies WHERE id = $1 RETURNING *";
    try {
      const result = await db.query(sql, [req.params.id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Movie not found" });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

// === DIRECTOR ROUTES ===

// GET all directors
app.get("/directors", async (req, res, next) => {
  const sql = 'SELECT id, name, "birthYear" FROM directors ORDER BY id ASC';
  try {
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET director by ID
app.get("/directors/:id", async (req, res, next) => {
  const sql = 'SELECT id, name, "birthYear" FROM directors WHERE id = $1';
  try {
    const result = await db.query(sql, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Director not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST director (Admin Only)
app.post(
  "/directors",
  [authenticateToken, authorizeRole("admin")],
  async (req, res, next) => {
    const { name, birthYear } = req.body;
    if (!name || !birthYear) {
      return res.status(400).json({ error: "name and birthYear are required" });
    }
    const sql =
      'INSERT INTO directors (name, "birthYear") VALUES ($1, $2) RETURNING *';
    try {
      const result = await db.query(sql, [name, birthYear]);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// PUT director by ID (Admin Only)
app.put(
  "/directors/:id",
  [authenticateToken, authorizeRole("admin")],
  async (req, res, next) => {
    const { name, birthYear } = req.body;
    const sql =
      'UPDATE directors SET name = $1, "birthYear" = $2 WHERE id = $3 RETURNING *';
    try {
      const result = await db.query(sql, [name, birthYear, req.params.id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Director not found" });
      }
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE director by ID (Admin Only)
app.delete(
  "/directors/:id",
  [authenticateToken, authorizeRole("admin")],
  async (req, res, next) => {
    const sql = "DELETE FROM directors WHERE id = $1 RETURNING *";
    try {
      const result = await db.query(sql, [req.params.id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Director not found" });
      }
      res.status(204).send(); // Status 204 No Content
    } catch (err) {
      next(err);
    }
  }
);

// === FALLBACK & ERROR HANDLING ===
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(" [SERVER ERROR]", err.stack);
  res.status(500).json({ error: "An error occurred on the server" });
});

app.listen(PORT, "0.0.0.0", () => {
  // Use '0.0.0.0' for Vercel deployment
  console.log(`Server is active at http://localhost: ${PORT}`);
});
