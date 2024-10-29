import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { prodManager } from "./product.manager.js";

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
            const carts = await fs.promises.readFile(this.path, "utf-8");
            const cartsJSON = JSON.parse(carts);
            return cartsJSON;
            } else {
                return [];
            } 
        } catch (error) {
            throw new Error(error);
        }
    }
    
    async createCart(obj) {
        try {
            const cart = {
                id: uuidv4(),
                products: [],
            };
        const cartsFile = await this.getCarts();
        cartsFile.push(cart);
        await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
        return cart;
        } catch (error) {
            throw new Error(error);
        }
    }
    
    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            return carts.find((c) => c.id === id);
        } catch (error) {
            throw new Error(error);
        }
    }

    async saveProductToCart(cartId, productId) {
        try {
            const prodExists = await prodManager.getById(productId);
            if (!prodExists) throw new Error("Product not exists");

            let cartsFile = await this.getCarts();
            const cartExists = await this.getCartById(cartId);
            if (!cartExists) throw new Error("Cart not exists");
            
            const existsProdInCart = cartExists.products.find((prod) => prod.id === productId);
            if (!existsProdInCart) {
                const product = {
                    id: productId,
                    quantity: 1
                };
                cartExists.products.push(product);
            } else existsProdInCart.quantity++;
            
            const updatedCarts = cartsFile.map((cart) => {
                if (cart.id === cartId) return cartExists;
                return cart;
            });
            
            await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts));
            return cartExists;

        } catch (error) {
            throw new Error(error);
        }
    }
}


export const cartManager = new CartManager(path.join(process.cwd(), "src/data/carts.json"));