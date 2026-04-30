// Repositorio de Productos

import { productDao } from '../dao/factory.js';

class ProductRepository {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    return await productDao.getProducts({ limit, page, sort, query });
  }
  
  async getProductById(id) {
    return await productDao.findById(id);
  }
  
  async createProduct(productData) {
    return await productDao.create(productData);
  }
  
  async updateProduct(id, updateData) {
    return await productDao.update(id, updateData);
  }
  
  async deleteProduct(id) {
    return await productDao.delete(id);
  }
  
  async updateStock(id, newStock) {
    return await productDao.update(id, { stock: newStock });
  }
}

export const productRepository = new ProductRepository();