import { ProductModel } from "../daos/models/product.model.js";
import createProductSchema from "../schemas/products.validator.js";

class ProductService {

    async getAll({ page = 1, limit = 10, query = '', sort = '' }) {
        try {
            const filter = query ? { category: query } : {};
            let sortOrder = {};
            if (sort === 'asc') sortOrder = { price: 1 };
            if (sort === 'desc') sortOrder = { price: -1 };

            const options = {
                page,
                limit,
                sort: sortOrder,
            };

            return await ProductModel.paginate(filter, options);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getById(id) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) throw new Error("Product not found");
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async create(productData) {
        try {
            const result = await createProductSchema.safeParse(productData);
            if (!result.success) {
                throw new Error(result.error.message);
            }
            const newProduct = new ProductModel(productData);
            return await newProduct.save();
        } catch (error) {
            throw new Error("Error creating product: " + error.message);
        }
    }

    async update(id, updatedData) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedData, { new: true });
            if (!updatedProduct) {
                throw new Error("Product not found");
            }
            return updatedProduct;
        } catch (error) {
            throw new Error("Error updating product: " + error.message);
        }
    }

    async delete(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new Error("Product not found");
            }
            return deletedProduct;
        } catch (error) {
            throw new Error("Error deleting product: " + error.message);
        }
    }
}

export default new ProductService();
