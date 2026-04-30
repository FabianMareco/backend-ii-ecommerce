// Middleware para autenticación JWT manual (alternativa a passport)

import jwt from 'jsonwebtoken';
import config from '../../config/config.js';

export const authJwt = (req, res, next) => {
  try {
    // Obtener token de la cookie
    const token = req.cookies[config.cookieName];
    
    if (!token) {
      return res.status(401).json({ error: 'No autenticado - token no encontrado' });
    }
    
    // Verificar token
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    res.status(500).json({ error: error.message });
  }
};