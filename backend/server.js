const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// Crear la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Cambia esto según tu configuración de MySQL
  password: '',  // Cambia esto según tu configuración
  database: 'proyecto'  // Nombre de tu base de datos
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Crear el servidor Express
const app = express();
app.use(cors());  // Habilitar CORS para todas las solicitudes
app.use(express.json());  // Permitir el manejo de solicitudes JSON

// Ruta de ejemplo: Obtener usuarios
app.get('/api/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});

// Iniciar el servidor
app.listen(5000, () => {
  console.log('Servidor backend escuchando en http://localhost:5000');
});
