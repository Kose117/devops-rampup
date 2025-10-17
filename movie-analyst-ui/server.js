var express = require('express');
var request = require('superagent');

var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views/');
app.use(express.static(__dirname + '/public'));

// Usa un ORIGIN completo con protocolo: "http://10.0.20.15:3000" o "http://backend.internal:3000"
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || 'http://localhost:3000';

// Health check del ALB para frontend: "/"
app.get('/', function(req, res){
  res.render('index');
});

// Rutas que consumen la API interna (sin tokens, todo es intra-VPC)
app.get('/movies', async function(req, res){
  try {
    const api = await request.get(`${BACKEND_ORIGIN}/api/movies`);
    res.render('movies', { movies: api.body });
  } catch (err) {
    console.error(err);
    res.status(502).send('Bad Gateway');
  }
});

app.get('/authors', async function(req, res){
  try {
    const api = await request.get(`${BACKEND_ORIGIN}/api/reviewers`);
    res.render('authors', { authors: api.body });
  } catch (err) {
    console.error(err);
    res.status(502).send('Bad Gateway');
  }
});

app.get('/publications', async function(req, res){
  try {
    const api = await request.get(`${BACKEND_ORIGIN}/api/publications`);
    res.render('publications', { publications: api.body });
  } catch (err) {
    console.error(err);
    res.status(502).send('Bad Gateway');
  }
});

// (Opcional) página que demuestra el 403 si algún día proteges scopes
app.get('/pending', async function(req, res){
  try {
    const api = await request.get(`${BACKEND_ORIGIN}/api/pending`);
    res.render('pending', { rows: api.body });
  } catch (err) {
    if (err?.status === 403) return res.status(403).send('403 Forbidden');
    console.error(err);
    res.status(502).send('Bad Gateway');
  }
});

app.listen(process.env.PORT || 3030, () => {
  console.log('frontend listening on', process.env.PORT || 3030);
});
