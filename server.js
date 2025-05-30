// server.js

// Importación de módulos
const express = require('express');         // Framework web
const path = require('path');               // Utilidades para rutas de archivos
const helmet = require('helmet');           // Cabeceras de seguridad básicas
const cors = require('cors');               // Permite configuraciones de CORS

// Variables de configuración (con valores por defecto)
const HOST = process.env.HOST || '0.0.0.0'; // Dirección donde el servidor escucha
const PORT = process.env.PORT || 3000;      // Puerto configurable por entorno

const app = express();                      // Instancia de la aplicación

// Middleware de seguridad
app.use(helmet());                          // Añade cabeceras HTTP seguras

// Configuración de CORS básica (permitir solicitudes desde cualquier origen)
app.use(cors());                            // Para una opción más segura, especifica un origen:
// app.use(cors({ origin: 'https://midominio.com' }));

// Middleware para parsear JSON y datos de formularios
app.use(express.json());                    // Para JSON en el body
app.use(express.urlencoded({ extended: true })); // Para datos URL-encoded

// Carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba para verificar que el servidor responde
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Ruta para manejar el formulario de contacto
app.post('/api/contacto', (req, res) => {
  const { nombre, correo, mensaje } = req.body;
  console.log('Formulario recibido:', { nombre, correo, mensaje });

  // Aquí podrías guardar en un archivo o base de datos si lo deseas

  // Respuesta al cliente
  res.status(200).json({
    estado: 'ok',
    mensaje: 'Gracias por contactarnos. Responderemos pronto.'
  });
});

// Iniciar el servidor en host y puerto configurados
typeof HOST === 'string' && app.listen(PORT, HOST, () => {
  console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
});
