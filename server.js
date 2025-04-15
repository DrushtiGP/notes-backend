require('dotenv').config();
import express, { json } from 'express';
import { createConnection } from 'mysql2';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(json());

// Load from env variables
const db = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT)
  });

db.connect(err => {
  if (err) console.error('DB Error: ', err);
  else console.log('Connected to MySQL');
});

app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  db.query('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ id: result.insertId, title, content });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
