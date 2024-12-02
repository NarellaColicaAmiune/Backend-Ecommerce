import { Router } from "express";
import * as productController from "../controllers/product.controllers.js";

const router = Router();

router.get("/", productController.getAll);

router.get("/:id", productController.getById);

router.post("/", productController.create);

router.put("/:id", productController.update);

router.delete("/:id", productController.deleteProd);

export default router;
