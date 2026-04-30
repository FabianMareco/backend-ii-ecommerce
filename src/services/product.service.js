// src/services/product.service.js
// Servicio de productos (lógica de negocio)

import { productRepository } from '../repositories/product.repository.js';

class ProductService {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    return await productRepository.getProducts({ limit, page, sort, query });
  }

  async getProductById(id) {
    return await productRepository.getProductById(id);
  }

  async createProduct(productData) {
    // Verificar que el código sea único
    const existing = await productRepository.getProducts({ query: `code:${productData.code}` });
    if (existing.payload && existing.payload.length > 0) {
      throw new Error('El código de producto ya existe');
    }
    return await productRepository.createProduct(productData);
  }

  async updateProduct(id, updateData) {
    // No permitir actualizar el código
    if (updateData.code) {
      delete updateData.code;
    }
    return await productRepository.updateProduct(id, updateData);
  }

  async deleteProduct(id) {
    return await productRepository.deleteProduct(id);
  }
}

export default new ProductService();