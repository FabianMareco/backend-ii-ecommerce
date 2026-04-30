import Cart from '../../models/Cart.js';

class CartDaoMongo {
  async create() {
    return await Cart.create({ products: [] });
  }

  async findById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async update(id, data) {
    return await Cart.findByIdAndUpdate(id, data, { returnDocument: 'after' }).populate('products.product');
  }

  async delete(id) {
    return await Cart.findByIdAndDelete(id);
  }
}

export default CartDaoMongo;
