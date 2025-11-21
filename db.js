const { Pool, Query } = require("pg");
const { param } = require("./routes/movie.routes");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  Query: (text, params) => pool.query(text, params),
};
