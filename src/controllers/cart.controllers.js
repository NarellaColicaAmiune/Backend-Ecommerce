import * as cartService from "../services/cart.services.js"

export const getCartById = async (req, res, next) => {
  try {
    const cid = req.user.cart
    const cart = await cartService.getCartById(cid)
    res.json(cart)
  } catch (error) {
    next(error)
  }
}

export const addProductToCart = async (req, res, next) => {
  try {
    const { pid } = req.params
    const cid = req.user.cart
    console.log({ cid, pid })
    const cart = await cartService.addProductToCart(cid, pid)
    res.json(cart)
  } catch (error) {
    next(error)
  }
}

export const deleteProductFromCart = async (req, res, next) => {
  try {
    const { pid } = req.params
    const cid = req.user.cart
    await cartService.deleteProductFromCart(cid, pid)
    res.status(200).json({ message: "Product removed from cart" })
  } catch (error) {
    next(error)
  }
}

export const updateCart = async (req, res, next) => {
  try {
    const { cid } = req.params
    const { products } = req.body
    await cartService.updateCart(cid, products)
    res.json({ message: "Cart updated successfully" })
  } catch (error) {
    next(error)
  }
}

export const updateProductQuantity = async (req, res, next) => {
  try {
    const { cid, pid } = req.params
    const { quantity } = req.body
    await cartService.updateProductQuantity(cid, pid, quantity)
    res.json({ message: "Product quantity updated" })
  } catch (error) {
    next(error)
  }
}

export const deleteAllProductsFromCart = async (req, res, next) => {
  try {
    const cid = req.user.cart
    await cartService.deleteAllProductsFromCart(cid)
    res.json({ message: "All products removed from cart" })
  } catch (error) {
    next(error)
  }
}
