import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || 'mi_secreto_super_seguro',
  cookieName: process.env.COOKIE_NAME || 'access_token',
  nodemailer: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
    host: process.env.NODEMAILER_HOST || 'smtp.gmail.com',
    port: process.env.NODEMAILER_PORT || 587,
  },
  clientUrlBase: process.env.CLIENT_URL_BASE || 'http://localhost:8080',
};