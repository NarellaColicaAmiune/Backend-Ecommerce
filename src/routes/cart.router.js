import { Router } from "express"
import * as cartController from "../controllers/cart.controllers.js"
import checkRole from "../middlewares/checkrole.js"
import passport from "passport"

const router = Router()

router.use(passport.authenticate('jwt'))
router.use(checkRole(["user"]))
router.get("/", cartController.getCartById)
router.post("/products/:pid", cartController.addProductToCart)
router.delete("/products/:pid", cartController.deleteProductFromCart)
router.delete("/", cartController.deleteAllProductsFromCart)
router.post("/:cid/purchase", cartController.purchaseCart)

export default router
