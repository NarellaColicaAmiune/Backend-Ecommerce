import { Router } from "express";
import productDao from "../daos/product.dao.js";

const router = Router();

router.get("/home", async (req, res) => {
    const products = await productDao.getAll();
    res.render("home", { products });
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    res.render("cart", { products: cart.products });
});

export default router;