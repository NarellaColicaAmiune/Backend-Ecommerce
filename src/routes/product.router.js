import { Router } from "express";
import {
    getAll,
    getById,
    create,
    update,
    deleteProd,
} from "../controllers/product.controllers.js";

const router = Router();

router.get("/", getAll);

router.get("/:id", getById);

router.post("/", create);

router.put("/:id", update);

router.delete("/:id", deleteProd);

export default router;