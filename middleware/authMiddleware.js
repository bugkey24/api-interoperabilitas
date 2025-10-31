const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  // Get token from header
  const authHeader = req.headers["authorization"];
  // Token format is "Bearer TOKEN"
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "Access denied, token not found" });
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      console.error("JWT Verify Error:", err.message);
      return res.status(403).json({ error: "Token is not valid or expired" });
    }

    // Attach user payload to the request object
    req.user = decodedPayload.user;

    // Proceed to the next middleware or route handler
    next();
  });
}

module.exports = authenticateToken;
