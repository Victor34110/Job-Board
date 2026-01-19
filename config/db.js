const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "jobster",
  password: process.env.DB_PASSWORD || "ton_mot_de_passe",
  port: process.env.DB_PORT || 5432,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Erreur de connexion à PostgreSQL :", err);
  } else {
    console.log("Connecté à PostgreSQL - Heure :", res.rows[0].now);
  }
});

module.exports = pool;
