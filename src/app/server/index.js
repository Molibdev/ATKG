const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Configurar middleware para parsear JSON y habilitar CORS
app.use(bodyParser.json());
app.use(cors());

// Conectar a la base de datos SQLite
let db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear tabla de usuarios si no existe
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT NOT NULL,
  score INTEGER NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 3)
)`);

// Ruta para obtener todos los usuarios
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Ruta para agregar un nuevo usuario
app.post('/api/users', (req, res) => {
  const { user, score, difficulty } = req.body;
  if (difficulty < 1 || difficulty > 3) {
    res.status(400).json({ error: 'La dificultad debe ser un número entre 1 y 3' });
    return;
  }
  db.run(`INSERT INTO users (user, score, difficulty) VALUES (?, ?, ?)`, [user, score, difficulty], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: { id: this.lastID, user, score, difficulty }
    });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
