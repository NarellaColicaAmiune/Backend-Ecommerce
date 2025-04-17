import CartModel from "../daos/models/cart.model.js"
import { ProductModel } from "../daos/models/product.model.js"
import { CustomError } from "../utils/error.custom.js"

export const getCartById = async (cartId) => {
  try {
    const cart = await CartModel.findById(cartId).populate("products.product")
    if (!cart) throw new CustomError("Cart not found", 404)
    return cart
  } catch (error) {
    console.log(error)
    throw new CustomError("Error getting cart by id", 500)
  }
}

export const addProductToCart = async (cartId, productId) => {
  try {
    const cart = await CartModel.findById(cartId)
    if (!cart) {
      cart = await CartModel.create({ products: [] })
    }

    console.log({ cart })

    const product = await ProductModel.findById(productId)
    if (!product) throw new CustomError("Product not found", 404)

    const existingProduct = cart.products.find(
      (p) => p.product.toString() === productId
    )
    if (existingProduct) {
      existingProduct.quantity += 1
    } else {
      cart.products.push({ product: productId, quantity: 1 })
    }

    await cart.save()
    return cart
  } catch (error) {
    throw new CustomError("Error adding product to cart", 500)
  }
}

export const deleteProductFromCart = async (cartId, productId) => {
  try {
    const cart = await CartModel.findById(cartId)
    if (!cart) throw new CustomError("Cart not found", 404)

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    )
    await cart.save()

    return cart
  } catch (error) {
    throw new CustomError("Error removing product from cart", 500)
  }
}

export const updateCart = async (cartId, products) => {
  try {
    const cart = await CartModel.findById(cartId)
    if (!cart) throw new CustomError("Cart not found", 404)

    cart.products = products.map((p) => ({
      product: p.productId,
      quantity: p.quantity,
    }))

    await cart.save()
    return cart
  } catch (error) {
    throw new CustomError("Error updating cart", 500)
  }
}

export const updateProductQuantityFromCart = async (
  cartId,
  productId,
  quantity
) => {
  try {
    const cart = await CartModel.findById(cartId)
    if (!cart) throw new CustomError("Cart not found", 404)
    const product = await ProductModel.findById(productId)
    if (!product) throw new CustomError("Product not found", 404)
    cart.products.find((p) => p.product.toString() === productId).quantity =
      quantity
    await cart.save()
    return cart
  } catch (error) {
    throw new CustomError("Error updating product quantity from cart", 500)
  }
}

export const deleteAllProductsFromCart = async (cartId) => {
  try {
    const cart = await CartModel.findById(cartId)
    if (!cart) throw new CustomError("Cart not found", 404)

    cart.products = []
    await cart.save()
    return cart
  } catch (error) {
    throw new CustomError("Error deleting all products from cart", 500)
  }
}
