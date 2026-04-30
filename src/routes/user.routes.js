// src/routes/user.routes.js
// Rutas para administración de usuarios (solo admin)

import { Router } from 'express';
import passport from '../config/passport.config.js';
import { handlePolicies } from '../middlewares/handlePolicies.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';

const router = Router();

// Todas las rutas de usuarios requieren autenticación y rol admin
router.use(
  passport.authenticate('current', { session: false }),
  handlePolicies(['admin'])
);

router.get('/', getAllUsers);
router.get('/:uid', getUserById);
router.put('/:uid', updateUser);
router.delete('/:uid', deleteUser);

export default router;