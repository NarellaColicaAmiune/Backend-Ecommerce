import { Router } from "express";
import { cartManager } from "../managers/cart.manager.js";
import Cart from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

const router = Router();

router.get("/:cartId", async (req, res) => {
    try {
        const { cartId } = req.params;
        const cart = await Cart.findById(cartId).populate("products.product");
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post("/:cartId/product/:productId", async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const response = await cartManager.saveProductToCart(cartId, productId);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.products = cart.products.filter((p) => p.product.toString() !== pid);
        await cart.save();

        res.json({ message: "Product removed from cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const product = cart.products.find((p) => p.product.toString() === pid);
        if (!product) return res.status(404).json({ error: "Product not in cart" });

        product.quantity = quantity;
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        res.json({ message: "Cart emptied" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;