// src/routes/products.routes.js
// Rutas para productos con autorización por roles

import { Router } from 'express';
import passport from '../config/passport.config.js';
import { handlePolicies } from '../middlewares/handlePolicies.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';

const router = Router();

// ==============================================
// RUTAS PÚBLICAS (cualquiera puede ver productos)
// ==============================================
router.get('/', getProducts);
router.get('/:pid', getProductById);

// ==============================================
// RUTAS PROTEGIDAS SOLO PARA ADMIN
// ==============================================
router.post('/',
  passport.authenticate('current', { session: false }),
  handlePolicies(['admin']),
  createProduct
);

router.put('/:pid',
  passport.authenticate('current', { session: false }),
  handlePolicies(['admin']),
  updateProduct
);

router.delete('/:pid',
  passport.authenticate('current', { session: false }),
  handlePolicies(['admin']),
  deleteProduct
);

export default router;