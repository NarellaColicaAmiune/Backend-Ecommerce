import CartModel from "../daos/models/cart.model.js"
import { ProductModel } from "../daos/models/product.model.js"
import { CustomError } from "../utils/error.custom.js"
import TicketModel from "../daos/models/ticket.model.js"
import crypto from "crypto"

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

// const cartSchema = new mongoose.Schema({
//   products: [
//     {
//       product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//       quantity: {
//         type: Number,
//         default: 1,
//         min: [1, "La cantidad mínima es 1"],
//       },
//     },
//   ],
// })

export const purchaseCart = async (cartId, purchaser) => {
  try {
    const cart = await CartModel.findById(cartId)
    if (!cart) throw new CustomError("Cart not found", 404)
      const productsToPurchase = []
      const productsWithoutStock = []
      console.log(cart.products)
    cart.products.forEach(async (p) => {
      const product = await ProductModel.findById(p.product)
      if (!product) throw new CustomError("Product not found", 404)
      if (product.stock < p.quantity) {
        productsWithoutStock.push(product)
        return
      }
      product.stock -= p.quantity
      await product.save()
      console.log(product)
      productsToPurchase.push(product)
    })
    console.log({ productsToPurchase })
    const totalPrice = productsToPurchase.reduce(
      (acc, p) => acc + p.price * p.quantity,
      0
    )
    const ticket =await TicketModel.create({ code: crypto.randomBytes(10).toString("hex"), purchase_datetime: new Date(), amount: totalPrice, purchaser })
    cart.products.filter((p) => { 
      if (!productsWithoutStock.includes(p.product)) {
        return p
      }
    })
    await cart.save()
    return { productsToPurchase, productsWithoutStock, ticket }
  } catch (error) {
    console.log(error)
    throw new CustomError("Error purchasing cart", 500)
  }
}