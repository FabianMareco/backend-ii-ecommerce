// src/utils/bcrypt.js
import bcrypt from 'bcrypt';

// Generar hash de una contraseña
export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Verificar si la contraseña coincide con el hash
export const isValidPassword = (password, hashedPassword) => {
  // Ambos argumentos son obligatorios
  if (!password || !hashedPassword) {
    console.error('isValidPassword: faltan argumentos', { password, hashedPassword });
    return false;
  }
  return bcrypt.compareSync(password, hashedPassword);
};