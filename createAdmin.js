import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './src/dao/models/user.model.js';
import Cart from './src/dao/models/cart.model.js';
import bcrypt from 'bcrypt';

dotenv.config();

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const existing = await User.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log('⚠️ El admin ya existe');
      process.exit(0);
    }
    
    const cart = await Cart.create({ products: [] });
    
    const admin = await User.create({
      first_name: 'Admin',
      last_name: 'Principal',
      email: 'admin@example.com',
      password: createHash('admin123'),
      role: 'admin',
      cart: cart._id
    });
    
    console.log('✅ Admin creado exitosamente:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();
