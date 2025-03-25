const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Clave API esperada
const VALID_API_KEY = '2f5ae96c-b558-4c7b-a590-a501ae1c3f6c';
// Clave secreta para firmar JWTs
const JWT_SECRET = 'mi_clave_secreta_segura';

app.use(express.json());

// Middleware para validar API Key
app.use((req, res, next) => {
  const apiKey = req.header('X-Parse-REST-API-Key');
  const jwtHeader = req.header('X-JWT-KWY');

  if (req.method === 'POST' && req.path === '/DevOps') {
    if (apiKey !== VALID_API_KEY) {
      return res.status(403).json({ error: 'API Key no válida' });
    }

    // Si viene un JWT en la cabecera, lo validamos (opcional para cliente)
    if (jwtHeader) {
      try {
        jwt.verify(jwtHeader, JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ error: 'JWT no válido' });
      }
    }
    next();
  } else if (req.path === '/DevOps') {
    return res.status(405).send('ERROR');
  } else {
    next();
  }
});

// POST /DevOps
app.post('/DevOps', (req, res) => {
  const { message, to, from, timeToLifeSec } = req.body;

  if (!message || !to || !from || !timeToLifeSec) {
    return res.status(400).json({ error: 'Faltan campos en el JSON de entrada' });
  }

  // Generar JWT único por transacción
  const token = jwt.sign({ id: uuidv4(), to, from }, JWT_SECRET, {
    expiresIn: timeToLifeSec
  });

  // Responder con mensaje + JWT
  res.setHeader('X-JWT-KWY', token);
  return res.json({
    message: `Hello ${to} your message will be send`
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Microservicio escuchando en http://localhost:${PORT}`);
});

