const db = require("../database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Load JWT_SECRET from .env
const JWT_SECRET = process.env.JWT_SECRET;

// POST /auth/register
exports.register = (req, res) => {
  const { username, password } = req.body;

  // Validation (from module)
  if (!username || !password || password.length < 6) {
    return res.status(400).json({
      error: "Username and password (min 6 char) are required",
    });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing:", err);
      return res.status(500).json({ error: "Failed to process registration" });
    }

    const sql = "INSERT INTO users (username, password) VALUES (?,?)";
    const params = [username.toLowerCase(), hashedPassword];

    db.run(sql, params, function (err) {
      if (err) {
        // Check for UNIQUE constraint failure
        if (err.message.includes("UNIQUE constraint")) {
          return res.status(409).json({ error: "Username already taken" });
        }
        console.error("Error inserting user:", err);
        return res.status(500).json({ error: "Failed to save user" });
      }

      res.status(201).json({
        message: "Registration successful",
        userId: this.lastID,
      });
    });
  });
};

// POST /auth/login
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.get(sql, [username.toLowerCase()], (err, user) => {
    // Check if user exists
    if (err || !user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Create JWT Payload
      const payload = {
        user: {
          id: user.id,
          username: user.username,
        },
      };

      // Sign the token
      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: "1h" }, // Token expires in 1 hour
        (err, token) => {
          if (err) {
            console.error("Error signing token:", err);
            return res.status(500).json({ error: "Failed to create token" });
          }

          res.json({
            message: "Login successful",
            token: token,
          });
        }
      );
    });
  });
};
