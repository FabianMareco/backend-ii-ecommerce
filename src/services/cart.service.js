// src/services/cart.service.js
// Servicio de carritos (lógica de negocio)

import { cartRepository } from '../repositories/cart.repository.js';
import { productRepository } from '../repositories/product.repository.js';

class CartService {
  async createCart() {
    return await cartRepository.createCart();
  }

  async getCartById(id) {
    return await cartRepository.getCartById(id);
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    // Verificar que el producto existe
    const product = await productRepository.getProductById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return await cartRepository.addProductToCart(cartId, productId, quantity);
  }

  async removeProductFromCart(cartId, productId) {
  const cart = await cartDao.findById(cartId);
  if (!cart) throw new Error('Carrito no encontrado');
  cart.products = cart.products.filter(p => p.product.toString() !== productId);
  return await cartDao.update(cartId, { products: cart.products });
}
  async updateCartProducts(cartId, products) {
    return await cartRepository.updateCartProducts(cartId, products);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await cartRepository.updateProductQuantity(cartId, productId, quantity);
  }

  async clearCart(cartId) {
    return await cartRepository.clearCart(cartId);
  }

  async deleteCart(cartId) {
    return await cartRepository.deleteCart(cartId);
  }
}

export default new CartService();