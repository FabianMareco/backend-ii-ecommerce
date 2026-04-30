// Configuración centralizada de variables de entorno

import dotenv from 'dotenv';
dotenv.config();

export default {
  // Servidor
  port: process.env.PORT || 8080,
  
  // MongoDB
  mongoUri: process.env.MONGODB_URI,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'mi_clave_secreta_por_defecto',
  cookieName: process.env.COOKIE_NAME || 'access_token',
  
  // Nodemailer
  nodemailer: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
    host: process.env.NODEMAILER_HOST || 'smtp.gmail.com',
    port: process.env.NODEMAILER_PORT || 587,
  },
  
  // URLs
  clientUrlBase: process.env.CLIENT_URL_BASE || 'http://localhost:8080',
  
  // Persistencia
  persistence: process.env.PERSISTENCE || 'mongo',
};