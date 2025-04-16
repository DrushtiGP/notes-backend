// Load environment variables first
require('dotenv').config();

// Import required modules
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Setup MySQL connection using env variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT)
});

// Connect to DB
db.connect(err => {
  if (err) {
    console.error('❌ DB Connection Error:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

// Routes
app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  db.query(
    'INSERT INTO notes (title, content) VALUES (?, ?)',
    [title, content],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ id: result.insertId, title, content });
    }
  );
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
