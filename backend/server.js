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
    db.query('SELECT * FROM usuarios LIMIT 1', (err, results) => {
        if (err) {
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/tickets_status', (req, res) => {
    db.query('SELECT estado_id,COUNT(id) as qty FROM tickets GROUP BY estado_id', (err, results) => {
        if (err) {
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/last_solved_ticket', (req, res) => {
    db.query('SELECT id, CONCAT(FLOOR(TIMESTAMPDIFF(MINUTE, creado_en, actualizado_en) / 60), " horas y ", LPAD(TIMESTAMPDIFF(MINUTE, creado_en, actualizado_en) % 60, 2, "0")," minutos") AS time, CONCAT(FLOOR(TIMESTAMPDIFF(MINUTE, actualizado_en, CURRENT_TIMESTAMP) / 60), " horas y ", LPAD(TIMESTAMPDIFF(MINUTE, actualizado_en, CURRENT_TIMESTAMP) % 60, 2, "0"), " minutos") AS solved FROM tickets WHERE estado_id = 2 ORDER BY actualizado_en DESC LIMIT 1;', (err, results) => {
        if (err) {
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/avg_solved_ticket', (req, res) => {
    db.query('SELECT CONCAT(FLOOR(AVG(TIMESTAMPDIFF(SECOND, creado_en, actualizado_en)) / 3600), " horas y ", LPAD(FLOOR((AVG(TIMESTAMPDIFF(SECOND, creado_en, actualizado_en)) % 3600) / 60), 2, "0"), " minutos") AS avg_time FROM tickets WHERE estado_id = 2;', (err, results) => {
        if (err) {
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/last_created_ticket', (req, res) => {
    db.query('SELECT id, CONCAT(FLOOR(TIMESTAMPDIFF(MINUTE, creado_en, CURRENT_TIMESTAMP) / 60), " horas y ", LPAD(TIMESTAMPDIFF(MINUTE, creado_en, CURRENT_TIMESTAMP) % 60, 2, "0"), " minutos") AS created FROM tickets WHERE estado_id = 1 ORDER BY creado_en DESC LIMIT 1;', (err, results) => {
        if (err) {
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/created_tickets', (req, res) => {
    db.query(`
        SELECT 
            t.id,
            CONCAT(
                FLOOR(TIMESTAMPDIFF(MINUTE, t.actualizado_en, CURRENT_TIMESTAMP) / 60), " horas y ",
                LPAD(TIMESTAMPDIFF(MINUTE, t.actualizado_en, CURRENT_TIMESTAMP) % 60, 2, "0"), " minutos"
            ) AS created,
            et.estado as estado_nombre
        FROM tickets t
        JOIN estados_ticket et ON t.estado_id = et.id
        ORDER BY t.actualizado_en DESC
        LIMIT 3;
    `, (err, results) => {
        if (err) {
            console.error('Error en la consulta', err);
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
