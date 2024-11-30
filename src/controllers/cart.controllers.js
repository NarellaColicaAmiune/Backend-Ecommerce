import * as cartService from "../services/cart.services.js";

export const deleteProductFromCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    await cartService.deleteProductFromCart(cid, pid);
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    next(error);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; 
    await cartService.updateCart(cid, products);
    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateProductQuantity = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    await cartService.updateProductQuantity(cid, pid, quantity);
    res.json({ message: 'Product quantity updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteAllProductsFromCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    await cartService.deleteAllProducts(cid);
    res.json({ message: 'All products removed from cart' });
  } catch (error) {
    next(error);
  }
};
