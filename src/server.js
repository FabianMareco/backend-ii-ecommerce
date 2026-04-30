import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { httpServer } from './app.js';
import config from '../config/config.js';

dotenv.config();

const PORT = config.port || 3000;

mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas correctamente');
    console.log(`📦 Base de datos: ${mongoose.connection.name}`);
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📦 API Products:   http://localhost:${PORT}/api/products`);
      console.log(`🛒 API Carts:      http://localhost:${PORT}/api/carts`);
      console.log(`🖥️  Vista catálogo: http://localhost:${PORT}/products`);
      console.log(`⚡ Tiempo real:    http://localhost:${PORT}/realtimeproducts`);
      console.log(`🔐 API Session:    http://localhost:${PORT}/api/session`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });