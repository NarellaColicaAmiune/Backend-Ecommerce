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

export const purchaseCart = async (cartId, purchaser) => {
  try {
    // Buscar el carrito por ID
    const cart = await CartModel.findById(cartId).populate("products.product")
    // Verificar si el carrito existe
    if (!cart) throw new CustomError("Cart not found", 404)
    // Verificar si hay stock suficiente para cada producto
    const outOfStockProducts = []
    const productsToPurchase = []
    for (const item of cart.products) {
      const product = item.product
      // Si hay stock suficiente, reducir el stock del producto
      if (product.stock >= item.quantity) {
        productsToPurchase.push(item)
      } else {
        // Si no hay stock suficiente, retornar los productos sin stock
        outOfStockProducts.push({
          product: product.name,
          requested: item.quantity,
          available: product.stock,
        })
      }
    }
    // Crear un ticket de compra
    const ticket = {
      code: crypto.randomUUID(),
      purchase_datetime: new Date(),
      amount: productsToPurchase.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
      purchaser,
    }
// Guardar el ticket en la base de datos
    const newTicket =
      ticket.amount > 0 ? await TicketModel.create(ticket) : null
    // Actualizar el stock de los productos comprados
    for (const item of productsToPurchase) {
      const product = item.product
      product.stock -= item.quantity
      await product.save()
    }
// Eliminar los productos comprados del carrito
    cart.products = cart.products.filter(
      (item) =>
        !productsToPurchase.some((p) => p.product._id == item.product._id)
    )
    await cart.save()

    // Retornar el ticket y los productos comprados
    return {
      ticket: newTicket,
      productsToPurchase,
      outOfStockProducts,
    }
} catch (error) {
    console.log(error)
    throw new CustomError("Error purchasing cart", 500)
  }
}