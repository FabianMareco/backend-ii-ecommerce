import { Router } from 'express';
import productService from '../services/product.service.js';
import cartService from '../services/cart.service.js';
import ticketService from '../services/ticket.service.js'; 

const router = Router();

// Vista de productos con paginación
router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const result = await productService.getProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query
    });
    
    res.render('products', {
      title: 'Catálogo de Productos',
      products: result.payload,
      pagination: {
        ...result,
        limit: parseInt(limit),
        sort: sort || '',
        query: query || ''
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar productos');
  }
});

// Vista de detalle de producto
router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.getProductById(pid);
    
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    
    const safeProduct = {
      _id: product._id,
      title: product.title || 'Sin título',
      description: product.description || 'Sin descripción',
      code: product.code || 'N/A',
      price: product.price || 0,
      stock: product.stock || 0,
      category: product.category || 'general',
      subcategory: product.subcategory || 'general',
      status: product.status !== undefined ? product.status : true,
      thumbnails: product.thumbnails || []
    };
    
    res.render('productDetail', {
      title: safeProduct.title,
      product: safeProduct
    });
  } catch (error) {
    console.error('Error al cargar el producto:', error);
    res.status(500).send('Error al cargar el producto: ' + error.message);
  }
});

// Vista de carrito
router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartService.getCartById(cid);
    
    if (!result) {
      return res.status(404).send('Carrito no encontrado');
    }
    
    const safeProducts = (result.products || []).map(item => ({
      product: {
        _id: item.product?._id || item.product,
        title: item.product?.title || 'Producto sin nombre',
        description: item.product?.description || '',
        code: item.product?.code || 'N/A',
        price: item.product?.price || 0,
        stock: item.product?.stock || 0,
        category: item.product?.category || '',
        subcategory: item.product?.subcategory || '',
        thumbnails: item.product?.thumbnails || []
      },
      quantity: item.quantity || 0,
      _id: item._id
    }));
    
    let total = 0;
    safeProducts.forEach(item => {
      total += (item.product.price || 0) * (item.quantity || 0);
    });
    
    res.render('cart', {
      title: 'Mi Carrito',
      cart: { _id: result._id },
      products: safeProducts,
      total: total,
      hasProducts: safeProducts.length > 0
    });
  } catch (error) {
    console.error('Error al cargar el carrito:', error);
    res.status(500).send('Error al cargar el carrito: ' + error.message);
  }
});

// Vista de productos en tiempo real (WebSockets)
router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productService.getProducts({ limit: 100, page: 1 });
    res.render('realTimeProducts', {
      title: 'Productos en Tiempo Real',
      products: products.payload
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la vista en tiempo real');
  }
});

// Vista del ticket después de la compra
router.get('/ticket/:tid', async (req, res) => {
  try {
    const { tid } = req.params;
    const { cartId, purchasedProducts: purchasedProductsRaw, failedProducts: failedProductsRaw } = req.query;
    
    // Obtener el ticket y convertirlo a objeto plano
    const ticketDoc = await ticketService.getTicketById(tid);
    if (!ticketDoc) {
      return res.status(404).send('Ticket no encontrado');
    }
    
    const ticket = ticketDoc.toObject ? ticketDoc.toObject() : { ...ticketDoc };
    
    // Parsear los productos comprados (vienen como JSON string desde la URL)
    let purchasedItems = [];
    let failedItems = [];
    
    if (purchasedProductsRaw) {
      try {
        purchasedItems = JSON.parse(purchasedProductsRaw);
      } catch (e) {
        console.error('Error parsing purchasedProducts:', e);
      }
    }
    
    if (failedProductsRaw) {
      try {
        failedItems = JSON.parse(failedProductsRaw);
        // Obtener detalles de los productos fallidos (opcional)
      } catch (e) {
        console.error('Error parsing failedProducts:', e);
      }
    }
    
    res.render('ticket', {
      title: 'Comprobante de Compra',
      ticket,
      cartId,
      purchasedItems,      // ← Productos comprados con detalles
      failedProducts: failedItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el ticket');
  }
});

// Vista home
router.get('/home', (req, res) => {
  res.redirect('/products');
});

export default router;