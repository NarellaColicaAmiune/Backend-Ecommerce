import { Router } from "express";
import ProductManager from "../managers/product.manager.js";
import path from "path";

const router = Router();
const prodManager = new ProductManager(path.join(process.cwd(), "src/data/products.json"));

router.get("/home", async (req, res) => {
    const products = await prodManager.getAll();
    res.render("home", { products });
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

export default router;