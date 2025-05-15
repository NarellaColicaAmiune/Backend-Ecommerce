import { Router } from "express";
import * as productController from "../controllers/product.controllers.js";
import checkRole from "../middlewares/checkrole.js";
import passport from "passport";

const router = Router();

router.get("/", productController.getAll);

router.get("/:id", productController.getById);

router.post("/", passport.authenticate('jwt'), checkRole(["admin"]), productController.create);

router.put("/:id", passport.authenticate('jwt'), checkRole(["admin"]), productController.update);

router.delete("/:id", passport.authenticate('jwt'), checkRole(["admin"]), productController.deleteProd);

export default router;
