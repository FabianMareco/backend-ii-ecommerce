// Repositorio de Carritos (capa intermedia entre controller y DAO)

import { cartDao } from '../dao/factory.js';

class CartRepository {
  async createCart() {
    return await cartDao.create();
  }
  
  async getCartById(id) {
    return await cartDao.findById(id);
  }
  
  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await cartDao.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');
    
    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
    
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    
    return await cartDao.update(cartId, { products: cart.products });
  }
  
  async removeProductFromCart(cartId, productId) {
    const cart = await cartDao.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');
    
    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    return await cartDao.update(cartId, { products: cart.products });
  }
  
  async updateCartProducts(cartId, products) {
    return await cartDao.update(cartId, { products });
  }
  
  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await cartDao.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');
    
    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if (productIndex === -1) throw new Error('Producto no encontrado en el carrito');
    
    cart.products[productIndex].quantity = quantity;
    return await cartDao.update(cartId, { products: cart.products });
  }
  
  async clearCart(cartId) {
    return await cartDao.update(cartId, { products: [] });
  }
  
  async deleteCart(cartId) {
    return await cartDao.delete(cartId);
  }
}

export const cartRepository = new CartRepository();