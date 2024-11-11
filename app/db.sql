-- Crear tabla de Usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255)
);

-- Crear tabla de Soporte
CREATE TABLE soporte (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    contrasena VARCHAR(255) NOT NULL
);

-- Crear tabla de Estados de Ticket
CREATE TABLE estados_ticket (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estado VARCHAR(255) NOT NULL UNIQUE
);

-- Crear tabla de Tickets
CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    estado_id INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    asunto VARCHAR(255) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (estado_id) REFERENCES estados_ticket(id)
);

-- Crear tabla de Mensajes
CREATE TABLE mensajes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT,
    contenido VARCHAR(255) NOT NULL,
    enviado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remitente VARCHAR(255) NOT NULL,
    es_soporte BOOLEAN DEFAULT FALSE,
    soporte_id INT,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (soporte_id) REFERENCES soporte(id)
);

-- Crear función para insertar mensaje
DELIMITER $$

CREATE PROCEDURE insertar_mensaje (IN ticket_id INT, IN contenido VARCHAR(255), IN remitente VARCHAR(255))
BEGIN
    -- Verificar si el remitente está registrado como usuario
    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE telefono = remitente) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El remitente no está registrado como usuario';
    END IF;

    -- Insertar el mensaje si el remitente está registrado
    INSERT INTO mensajes (ticket_id, contenido, remitente) VALUES (ticket_id, contenido, remitente);
END $$

DELIMITER ;
