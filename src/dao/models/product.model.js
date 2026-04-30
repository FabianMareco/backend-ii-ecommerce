import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  category: { type: String, required: true, lowercase: true },
  subcategory: { type: String, lowercase: true, default: 'general' },
  status: { type: Boolean, default: true },
  thumbnails: { type: [String], default: [] }
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);
export default Product;
