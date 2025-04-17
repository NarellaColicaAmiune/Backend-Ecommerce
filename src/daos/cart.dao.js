import mongoose from 'mongoose';
import { CustomError } from '../utils/error.custom.js';
import cartModel from "./models/cart.model.js"

class CartDaoMongoDB {
    constructor() {
        this.model = cartModel; 
    }

    async createCart() {
        try {
            const newCart = new this.model({
                products: [], 
            });
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error('Error al crear el carrito: ' + error.message);
        }
    }

    async getById(cartId) {
        try {
            const cart = await this.model.findById(cartId).populate('products.product');
            if (!cart) throw new Error('Carrito no encontrado');
            return cart;
        } catch (error) {
            throw new Error('Error al obtener el carrito: ' + error.message);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            if (quantity <= 0 || !Number.isInteger(quantity)) {
                throw new Error('Cantidad inválida');
            }
    
            const cart = await this.model.findById(cartId);
            if (!cart) throw new CustomError('Carrito no encontrado', 404);
    
            const productExists = cart.products.find(p => p.product.toString() === productId);
            if (productExists) {
                productExists.quantity += quantity;
            } else {
                const newProduct = { product: productId, quantity };
                cart.products.push(newProduct);
            }
    
            await cart.save();
            return cart;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Error al agregar producto al carrito: ' + error.message, 500);
        }
    }    

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.model.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            const product = cart.products.find(p => p.product.toString() === productId);
            if (!product) throw new Error('Producto no encontrado en el carrito');

            product.quantity = quantity;
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error al actualizar la cantidad del producto: ' + error.message);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.model.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error al eliminar el producto del carrito: ' + error.message);
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await this.model.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error al vaciar el carrito: ' + error.message);
        }
    }
}

export default CartDaoMongoDB;