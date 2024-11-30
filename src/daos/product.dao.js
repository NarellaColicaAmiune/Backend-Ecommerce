import { ProductModel } from './models/product.model.js';

class ProductDao {
  async getAll(query = {}, options = {}) {
    try {
      const { page = 1, limit = 10, sort, category, minPrice, maxPrice } = options;
  
      const filters = { ...query };
  
      if (category) filters.category = category;
      if (minPrice) filters.price = { ...filters.price, $gte: minPrice }; 
      if (maxPrice) filters.price = { ...filters.price, $lte: maxPrice }; 
  
      const paginationOptions = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: sort ? { [sort]: 1 } : {},
      };
  
      const result = await ProductModel.paginate(filters, paginationOptions);
  
      return result
    } catch (error) {
      console.error('Error al obtener productos con filtros/paginación:', error);
      throw new Error('No se pudieron obtener los productos.');
    }
  }

  async create(productData) {
    try {
      const newProduct = new ProductModel(productData);
      return await newProduct.save();
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw new Error('No se pudo crear el producto.');
    }
  }

  async getById(productId) {
    try {
      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new Error('Producto no encontrado.');
      }
      return product;
    } catch (error) {
      console.error(`Error al obtener el producto con ID ${productId}:`, error);
      throw new Error('No se pudo obtener el producto.');
    }
  }

  async update(productId, updatedData) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        updatedData,
        { new: true }
      );
      if (!updatedProduct) {
        throw new Error('Producto no encontrado.');
      }
      return updatedProduct;
    } catch (error) {
      console.error(`Error al actualizar el producto con ID ${productId}:`, error);
      throw new Error('No se pudo actualizar el producto.');
    }
  }

  async deleteProd(productId) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(productId);
      if (!deletedProduct) {
        throw new Error('Producto no encontrado.');
      }
      return deletedProduct;
    } catch (error) {
      console.error(`Error al eliminar el producto con ID ${productId}:`, error);
      throw new Error('No se pudo eliminar el producto.');
    }
  }
}

const prodDao = new ProductDao(ProductModel);

export default prodDao;