// Controlador de carritos con validación de propiedad

import cartService from '../services/cart.service.js';
import ticketService from '../services/ticket.service.js';
import productService from '../services/product.service.js';

// ==============================================
// VER CARRITO (con validación de propiedad)
// ==============================================
export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    
    // VALIDACIÓN: Verificar que el carrito pertenezca al usuario autenticado
    if (req.user.cart && req.user.cart.toString() !== cid) {
      return res.status(403).json({ 
        error: 'No tienes permiso para acceder a este carrito' 
      });
    }
    
    const cart = await cartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ==============================================
// AGREGAR PRODUCTO AL CARRITO (con validación de propiedad)
// ==============================================
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = req.body && req.body.quantity ? req.body.quantity : 1;
    
    // VALIDACIÓN: Verificar que el carrito pertenezca al usuario autenticado
    if (req.user.cart && req.user.cart.toString() !== cid) {
      return res.status(403).json({ 
        error: 'No tienes permiso para modificar este carrito' 
      });
    }
    
    const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// ==============================================
// ELIMINAR PRODUCTO DEL CARRITO (con validación de propiedad)
// ==============================================
export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    
    // VALIDACIÓN
    if (req.user.cart && req.user.cart.toString() !== cid) {
      return res.status(403).json({ 
        error: 'No tienes permiso para modificar este carrito' 
      });
    }
    
    const updatedCart = await cartService.removeProductFromCart(cid, pid);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// ==============================================
// ACTUALIZAR TODO EL CARRITO (con validación de propiedad)
// ==============================================
export const updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    
    // VALIDACIÓN
    if (req.user.cart && req.user.cart.toString() !== cid) {
      return res.status(403).json({ 
        error: 'No tienes permiso para modificar este carrito' 
      });
    }
    
    const updatedCart = await cartService.updateCartProducts(cid, products);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// ==============================================
// ACTUALIZAR CANTIDAD DE UN PRODUCTO (con validación)
// ==============================================
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        error: 'La cantidad debe ser mayor a 0' 
      });
    }
    
    // VALIDACIÓN
    if (req.user.cart && req.user.cart.toString() !== cid) {
      return res.status(403).json({ 
        error: 'No tienes permiso para modificar este carrito' 
      });
    }
    
    const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// ==============================================
// VACIAR CARRITO (con validación de propiedad)
// ==============================================
export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    
    // VALIDACIÓN
    if (req.user.cart && req.user.cart.toString() !== cid) {
      return res.status(403).json({ 
        error: 'No tienes permiso para modificar este carrito' 
      });
    }
    
    const clearedCart = await cartService.clearCart(cid);
    res.json({ status: 'success', payload: clearedCart });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// ==============================================
// FINALIZAR COMPRA (con validación de propiedad)
// ==============================================
// FINALIZAR COMPRA (TICKET)
export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const userEmail = req.user.email;

    if (req.user.cart.toString() !== cid) {
      return res.status(403).json({ error: 'No tienes permiso para comprar este carrito' });
    }

    const cart = await cartService.getCartById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const productsToBuy = cart.products;
    const purchasedProducts = [];      // ← Guardaremos los productos COMPRADOS (con detalles)
    const failedProducts = [];
    let totalAmount = 0;

    for (const item of productsToBuy) {
      const product = await productService.getProductById(item.product._id);
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await productService.updateProduct(product._id, { stock: product.stock });
        
        // Guardar producto comprado con sus detalles
        purchasedProducts.push({
          product: {
            _id: product._id,
            title: product.title,
            price: product.price,
            code: product.code
          },
          quantity: item.quantity
        });
        
        totalAmount += product.price * item.quantity;
      } else {
        failedProducts.push(item.product._id);
      }
    }

    let ticket = null;
    if (purchasedProducts.length > 0) {
      ticket = await ticketService.createTicket({
        amount: totalAmount,
        purchaser: userEmail
      });
    }

    // Actualizar carrito: solo quedan los productos fallidos
    const remainingProducts = cart.products.filter(item =>
      failedProducts.includes(item.product._id)
    );
    await cartService.updateCartProducts(cid, remainingProducts);

    res.json({
      status: 'success',
      payload: {
        ticket,
        purchasedProducts,     // ← Ahora enviamos los productos comprados
        failedProducts,
        totalAmount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ==============================================
// CREAR CARRITO (público, sin validación)
// ==============================================
export const createCart = async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};