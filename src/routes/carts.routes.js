// src/routes/carts.routes.js
// Rutas para carritos con autorización por roles

import { Router } from 'express';
import passport from '../config/passport.config.js';
import { handlePolicies } from '../middlewares/handlePolicies.js';
import {
  createCart,
  getCart,
  addProductToCart,
  removeProductFromCart,
  updateCartProducts,
  updateProductQuantity,
  clearCart,
  purchaseCart
} from '../controllers/cart.controller.js';

const router = Router();

// ==============================================
// CREAR CARRITO (público, pero generalmente se crea al registrar usuario)
// ==============================================
router.post('/', createCart);

// ==============================================
// VER CARRITO (requiere autenticación)
// ==============================================
router.get('/:cid',
  passport.authenticate('current', { session: false }),
  getCart
);

// ==============================================
// AGREGAR PRODUCTO AL CARRITO (solo usuarios autenticados)
// ==============================================
router.post('/:cid/products/:pid',
  passport.authenticate('current', { session: false }),
  handlePolicies(['user']),
  addProductToCart
);

// ==============================================
// ELIMINAR PRODUCTO DEL CARRITO
// ==============================================
router.delete('/:cid/products/:pid',
  passport.authenticate('current', { session: false }),
  handlePolicies(['user']),
  removeProductFromCart
);

// ==============================================
// ACTUALIZAR TODO EL CARRITO
// ==============================================
router.put('/:cid',
  passport.authenticate('current', { session: false }),
  handlePolicies(['user']),
  updateCartProducts
);

// ==============================================
// ACTUALIZAR CANTIDAD DE UN PRODUCTO
// ==============================================
router.put('/:cid/products/:pid',
  passport.authenticate('current', { session: false }),
  handlePolicies(['user']),
  updateProductQuantity
);

// ==============================================
// VACIAR CARRITO
// ==============================================
router.delete('/:cid',
  passport.authenticate('current', { session: false }),
  handlePolicies(['user']),
  clearCart
);

// ==============================================
// FINALIZAR COMPRA (generar ticket)
// ==============================================
router.post('/:cid/purchase',
  passport.authenticate('current', { session: false }),
  handlePolicies(['user']),
  purchaseCart
);

export default router;