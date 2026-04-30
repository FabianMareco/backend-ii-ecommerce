import Product from '../../models/Product.js';

class ProductDaoMongo {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    let filter = {};
    if (query) {
      if (query.includes(':')) {
        const [key, value] = query.split(':');
        filter[key] = value;
      } else {
        filter = {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { code: { $regex: query, $options: 'i' } }
          ]
        };
      }
    }

    let sortOption = {};
    if (sort === 'asc') {
      sortOption = { price: 1 };
    } else if (sort === 'desc') {
      sortOption = { price: -1 };
    } else {
      sortOption = { title: 1 }; // ← Orden alfabético por defecto
    }

    const skip = (page - 1) * limit;
    const totalDocs = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort || ''}&query=${query || ''}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort || ''}&query=${query || ''}` : null
    };
  }

  async findById(id) {
    return await Product.findById(id);
  }

  async create(productData) {
    return await Product.create(productData);
  }

  async update(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }
}

export default ProductDaoMongo;