const express = require('express');
const app = express();
const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'applicationuser',
  password: process.env.DB_PASS || 'applicationuser',
  database: process.env.DB_NAME || 'movie_db'
});
pool.query = util.promisify(pool.query);

// Health check para ALB backend
app.get('/api/health', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

// Movies
app.get('/api/movies', async (req, res) => {
  try {
    const rows = await pool.query(
      'SELECT m.title, m.release_year, m.score, r.name AS reviewer, p.name AS publication ' +
      'FROM movies m JOIN reviewers r ON m.reviewer=r.name ' +
      'JOIN publications p ON r.publication=p.name'
    );
    res.json(rows);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

// Reviewers (corrigido: ahora sí consulta reviewers)
app.get('/api/reviewers', async (req, res) => {
  try {
    const rows = await pool.query('SELECT name, publication, avatar FROM reviewers');
    res.json(rows);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

// Publications
app.get('/api/publications', async (req, res) => {
  try {
    const rows = await pool.query('SELECT name, avatar FROM publications');
    res.json(rows);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

// Pending (ejemplo “admin”)
app.get('/api/pending', async (req, res) => {
  try {
    const rows = await pool.query(
      'SELECT m.title, m.release_year, m.score, r.name AS reviewer, p.name AS publication ' +
      'FROM movies m JOIN reviewers r ON m.reviewer=r.name ' +
      'JOIN publications p ON r.publication=p.name ' +
      'WHERE m.release_year >= 2017'
    );
    res.json(rows);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

// Health de servicio (no lo usa el ALB, pero útil)
app.get('/', (req, res) => {
  res.status(200).send({ service_status: 'Up' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('backend listening on', PORT));

module.exports = app;
