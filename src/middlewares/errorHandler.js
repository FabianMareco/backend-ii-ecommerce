// Middleware global para manejo de errores

export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // Errores de MongoDB
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.message
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      error: 'Error de duplicado',
      details: `El campo ${Object.keys(err.keyPattern)} ya existe`
    });
  }
  
  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token inválido' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expirado' });
  }
  
  // Error genérico
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
};

// Middleware para rutas no encontradas
export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.url}` });
};