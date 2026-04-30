// src/routes/session.routes.js
// Rutas para autenticación y recuperación de contraseña

import { Router } from 'express';
import passport from '../config/passport.config.js';
import {
  register,
  login,
  logout,
  current,
  forgotPassword,
  resetPassword
} from '../controllers/session.controller.js';

const router = Router();

// ==============================================
// REGISTRO Y LOGIN
// ==============================================
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// ==============================================
// USUARIO ACTUAL (requiere autenticación)
// ==============================================
router.get('/current',
  passport.authenticate('current', { session: false }),
  current
);

// ==============================================
// RECUPERACIÓN DE CONTRASEÑA
// ==============================================
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;