import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import dotenv from 'dotenv';

import __dirname from './utils.js';
import './config/passport.config.js';
import connectDB from './config/db.js';
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';
import sessionRouter from './routes/session.routes.js';
import userRouter from './routes/user.routes.js';
import viewsRouter from './routes/views.routes.js';
import productService from './services/product.service.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Conectar a MongoDB
connectDB();

// Configuración de Handlebars
const hbs = engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  helpers: {
    multiply: (a, b) => a * b,
    eq: (a, b) => a == b,
    formatDate: (date) => {
      if (!date) return 'N/A';
      const d = new Date(date);
      return d.toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
});
app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/session', sessionRouter);
app.use('/api/users', userRouter);
app.use('/', viewsRouter);

app.get('/', (req, res) => res.redirect('/products'));

// WebSockets
io.on('connection', async (socket) => {
  console.log('🟢 Cliente conectado:', socket.id);

  try {
    const initialProducts = await productService.getProducts({ limit: 100, page: 1 });
    socket.emit('updateProducts', initialProducts.payload);
  } catch (error) {
    console.error('Error al enviar productos iniciales:', error.message);
  }

  socket.on('newProduct', async (productData) => {
    try {
      await productService.createProduct(productData);
      const allProducts = await productService.getProducts({ limit: 100, page: 1 });
      io.emit('updateProducts', allProducts.payload);
    } catch (error) {
      socket.emit('errorMessage', error.message);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      await productService.deleteProduct(productId);
      const allProducts = await productService.getProducts({ limit: 100, page: 1 });
      io.emit('updateProducts', allProducts.payload);
    } catch (error) {
      socket.emit('errorMessage', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });
});

// Middleware de errores
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
app.use(notFoundHandler);
app.use(errorHandler);

// Exportar tanto app como httpServer
export { app, httpServer };