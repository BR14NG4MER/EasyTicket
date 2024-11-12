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

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/all_users', (req, res) => {
    const query = 'SELECT id, nombre FROM usuarios';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener los clientes:', err);
            return res.status(500).send({ message: 'Error al obtener los clientes' });
        }
        return res.status(200).json(result);
    });
});

app.get('/api/all_supports', (req, res) => {
    const query = 'SELECT id as soporte_id, nombre as soporte_nombre FROM soporte';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener los clientes:', err);
            return res.status(500).send({ message: 'Error al obtener los clientes' });
        }
        return res.status(200).json(result);
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

app.get('/api/all_tickets', (req, res) => {
    db.query(`
        SELECT 
            t.id,
            t.titulo,
            t.asunto,
            et.estado AS estado_nombre,
            us.nombre AS nombre,
            us.id AS usuario_id,
            sp.id AS soporte_id,
            sp.nombre AS soporte_nombre
        FROM tickets t
        JOIN estados_ticket et ON t.estado_id = et.id
        JOIN usuarios us ON t.usuario_id = us.id
        JOIN soporte sp ON t.soporte_id = sp.id
        ORDER BY t.actualizado_en DESC
    `, (err, results) => {
        if (err) {
            console.error('Error en la consulta', err);
            return res.status(500).send({ message: 'Error en el servidor' });
        }
        res.json(results);
    });
});

app.delete('/api/delete_ticket/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tickets WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el registro:', err);
            return res.status(500).send({ message: 'Error al eliminar el registro' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Registro no encontrado' });
        }
        return res.status(200).send({ message: 'Registro eliminado exitosamente' });
    });
});

app.put('/api/update_ticket/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, asunto, usuario_id } = req.body;
    const query = 'UPDATE tickets SET titulo = ?, asunto = ?, usuario_id = ? WHERE id = ?';
    db.query(query, [titulo, asunto, usuario_id, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el ticket:', err);
            return res.status(500).send({ message: 'Error al actualizar el ticket' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Ticket no encontrado' });
        }
        return res.status(200).send({ message: 'Ticket actualizado exitosamente' });
    });
});

app.post('/api/add_ticket', (req, res) => {
    const { titulo, asunto, usuario_id } = req.body;
    const querySoporte = `
        SELECT  soporte.id as soporte_id 
        FROM soporte 
        LEFT JOIN tickets ON soporte.id = tickets.soporte_id 
        GROUP BY soporte.id 
        ORDER BY COUNT(tickets.id) ASC 
        LIMIT 1
    `;
    db.query(querySoporte, (err, results) => {
        if (err) {
            console.log('Error al obtener el soporte con menos tickets:', err);
            return res.status(500).send({ message: 'Error al obtener el soporte con menos tickets' });
        }
        const soporte_id = results.length > 0 ? results[0].soporte_id : 1;
        const queryInsert = `
            INSERT INTO tickets (titulo, asunto, usuario_id, soporte_id) 
            VALUES (?, ?, ?, ?)
        `;
        db.query(queryInsert, [titulo, asunto, usuario_id, soporte_id], (err, result) => {
            if (err) {
                console.error('Error al agregar el ticket:', err);
                return res.status(500).send({ message: 'Error al agregar el ticket' });
            }
            return res.status(201).send({
                id: result.insertId,
                titulo,
                asunto,
                usuario_id,
                soporte_id
            });
        });
    });
});



// Iniciar el servidor
app.listen(5000, () => {
    console.log('Servidor backend escuchando en http://localhost:5000');
});
