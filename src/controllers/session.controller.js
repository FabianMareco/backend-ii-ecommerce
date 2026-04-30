// Controlador para manejo de sesiones, registro, login y recuperación de contraseña

import { userRepository } from '../repositories/user.repository.js';
import { cartDao } from '../dao/factory.js';
import { generateToken } from '../utils/jwt.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { sendRecoveryEmail } from '../utils/mailer.js';
import UserDto from '../dtos/user.dto.js';
import crypto from 'crypto';

// ==============================================
// REGISTRO DE USUARIO (con creación automática de carrito)
// ==============================================
export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Validar campos obligatorios
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Crear un carrito vacío para el usuario
    const newCart = await cartDao.create();

    // Hashear la contraseña
    const hashedPassword = createHash(password);

    // Crear el usuario con el carrito asociado
    const newUser = await userRepository.createUser({
      first_name,
      last_name,
      email,
      age: age || null,
      password: hashedPassword,
      role: 'user',
      cart: newCart._id
    });

    // Generar token JWT
    const token = generateToken(newUser);

    // Establecer cookie
    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: new UserDto(newUser)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ==============================================
// LOGIN DE USUARIO
// ==============================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña (necesitamos la contraseña hasheada del usuario original)
    const userFromDb = await userRepository.getUserByEmailWithPassword(email);
    if (!isValidPassword(password, userFromDb.password)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken(userFromDb);
    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login exitoso',
      user: new UserDto(userFromDb)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ==============================================
// LOGOUT
// ==============================================
export const logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.json({ message: 'Logout exitoso' });
};

// ==============================================
// OBTENER USUARIO ACTUAL (con DTO)
// ==============================================
export const current = async (req, res) => {
  try {
    // req.user viene de passport.authenticate
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const userDto = new UserDto(req.user);
    res.json({ user: userDto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ==============================================
// SOLICITUD DE RECUPERACIÓN DE CONTRASEÑA
// ==============================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email es requerido' });
    }

    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Generar token único
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // 1 hora

    await userRepository.setResetToken(email, token, expires);
    await sendRecoveryEmail(email, token);

    res.json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ==============================================
// RESTABLECER CONTRASEÑA
// ==============================================
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token y nueva contraseña son requeridos' });
    }

    const user = await userRepository.findByResetToken(token);
    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const hashedPassword = createHash(newPassword);
    await userRepository.updatePassword(user.email, hashedPassword);

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};