require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route for testing
app.get('/', (req, res) => {
  res.send('📝 Notes API is running!');
});

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT)
});

db.connect(err => {
  if (err) {
    console.error('DB Error: ', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

// GET all notes
app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// POST a new note
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

// Start server
app.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});
