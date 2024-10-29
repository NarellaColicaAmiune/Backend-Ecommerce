import { Router } from "express";
import { productValidator } from "../middlewares/product.validator.js";
import ProductManager from "../managers/product.manager.js";
import path from "path";

const prodManager = new ProductManager(path.join(process.cwd(), "src/data/products.json"));

const router = Router();

router.get("/", async (req, res) => {
    try {
        const prods = await prodManager.getAll();
        res.status(200).json(prods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const prod = await prodManager.getById(id);
        res.status(200).json(prod);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.post("/", [productValidator], async (req, res) => {
    try {
        const prod = await prodManager.create(req.body);
        res.status(201).json(prod);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/", async (req, res) => {
    try {
        await prodManager.deleteAll();
        res.json({ message: "All products deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const prodDel = await prodManager.delete(id);
        res.status(200).json({ mesagge: `Product id: ${prodDel.id} deleted` });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const prodUpd = await prodManager.update(req.body, id);
        res.status(200).json(prodUpd);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;