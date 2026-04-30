// Controlador para productos (CRUD básico)

import productService from '../services/product.service.js';

// ==============================================
// OBTENER PRODUCTOS CON PAGINACIÓN
// ==============================================
export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    
    const result = await productService.getProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query
    });
    
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ==============================================
// OBTENER PRODUCTO POR ID
// ==============================================
export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.getProductById(pid);
    
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    
    res.json({ status: 'success', payload: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ==============================================
// CREAR PRODUCTO (solo admin)
// ==============================================
export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      status: req.body.status !== undefined ? req.body.status : true
    };
    
    const newProduct = await productService.createProduct(productData);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// ==============================================
// ACTUALIZAR PRODUCTO (solo admin)
// ==============================================
export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = await productService.updateProduct(pid, req.body);
    
    if (!updatedProduct) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    
    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// ==============================================
// ELIMINAR PRODUCTO (solo admin)
// ==============================================
export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const deleted = await productService.deleteProduct(pid);
    
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    
    res.json({ status: 'success', message: 'Producto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};