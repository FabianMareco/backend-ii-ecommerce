// Middleware para autorización basada en roles

export const handlePolicies = (allowedRoles) => {
  return (req, res, next) => {
    // req.user debe ser seteado por passport.authenticate('current')
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: `Acceso denegado. Se requiere rol: ${allowedRoles.join(' o ')}` 
      });
    }
    
    next();
  };
};