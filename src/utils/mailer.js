// utils/mailer.js
import nodemailer from 'nodemailer';
import config from '../../config/config.js';

const transporter = nodemailer.createTransport({
  host: config.nodemailer.host,
  port: config.nodemailer.port,
  secure: false,
  auth: {
    user: config.nodemailer.user,
    pass: config.nodemailer.pass,
  },
});

export const sendRecoveryEmail = async (toEmail, token) => {
  const resetLink = `${config.clientUrlBase}/api/session/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"Ecommerce Danza" <${config.nodemailer.user}>`,
    to: toEmail,
    subject: 'Recuperación de contraseña',
    html: `
      <h3>Restablece tu contraseña</h3>
      <p>Haz clic en el siguiente enlace, es válido por 1 hora:</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  });
};