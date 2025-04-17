import { Router } from "express"
import ProductService from "../daos/product.dao.js"
import CartDaoMongoDB from "../daos/cart.dao.js"
import CartModel from "../daos/models/cart.model.js"
import { getUser } from "../middlewares/getUser.js"

const router = Router()

router.get("/home", async (req, res) => {
  const products = await ProductService.getAll()

  const productsParsed = {}

  productsParsed["products"] = products.docs.map((doc) => ({
    name: doc.name,
    price: doc.price,
    stock: doc.stock,
    category: doc.category,
    description: doc.description,
    _id: doc._id,
  }))

  productsParsed["totalPages"] = products.totalPages
  productsParsed["page"] = products.page
  productsParsed["hasPrevPage"] = products.hasPrevPage
  productsParsed["hasNextPage"] = products.hasNextPage
  productsParsed["prevPage"] = products.prevPage
  productsParsed["nextPage"] = products.nextPage

  res.render("home", { products: productsParsed })
})

router.get("/realtimeproducts", async (req, res) => {
  const { docs } = await ProductService.getAll()

  const products = docs.map((doc) => ({
    name: doc.name,
    price: doc.price,
    stock: doc.stock,
    category: doc.category,
    description: doc.description,
    _id: doc._id,
  }))

  res.render("realTimeProducts", { products })
})

router.get("/cart", async (req, res) => {
  res.render("cart")
})

router.get("/register", (req, res) => {
  res.render("register")
})

router.get("/login", (req, res) => {
  res.render("login")
})

export default router
