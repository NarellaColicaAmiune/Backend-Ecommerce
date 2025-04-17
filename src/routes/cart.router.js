import { Router } from "express"
import * as cartController from "../controllers/cart.controllers.js"
import { getUser } from "../middlewares/getUser.js"

const router = Router()

router.use(getUser)
router.get("/", cartController.getCartById)
router.post("/products/:pid", cartController.addProductToCart)
router.delete("/products/:pid", cartController.deleteProductFromCart)
router.delete("/", cartController.deleteAllProductsFromCart)

export default router
