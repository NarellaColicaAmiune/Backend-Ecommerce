import { Router } from "express"
import ProductService from "../daos/product.dao.js"
import CartDaoMongoDB from "../daos/cart.dao.js"
import CartModel from "../daos/models/cart.model.js"
import { getUser } from "../middlewares/getUser.js"
import { homeController, realTimeProductsController, cartController, registerController, loginController } from "../controllers/views.controllers.js"

const router = Router()

router.get("/home", homeController)

router.get("/realtimeproducts", realTimeProductsController)

router.get("/cart", cartController)

router.get("/register", registerController)

router.get("/login", loginController)

export default router
