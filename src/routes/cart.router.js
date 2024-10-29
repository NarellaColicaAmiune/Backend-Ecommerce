import { Router } from "express";
import { cartManager } from "../managers/cart.manager.js";
const router = Router();

router.post('/', async (req, res) => {
    try {
        res.json(await cartManager.createCart());
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;
        res.json(await cartManager.getCartById(cartId));
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/:cartId/product/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const response = await cartManager.saveProductToCart(cartId, productId);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;