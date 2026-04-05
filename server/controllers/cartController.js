const {
  getProductById,
  getCartItemByUserAndProduct,
  addToCart,
  increaseExistingCartItem,
  getCartByUser,
  getCartItemById,
  updateCartItemQuantity,
  removeCartItem
} = require("../models/cartModel");

const addItemToCart = (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  getProductById(product_id, (productErr, productResults) => {
    if (productErr) {
      return res.status(500).json({ error: productErr.message });
    }

    if (!productResults.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResults[0];

    if (product.stock <= 0) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    getCartItemByUserAndProduct(user_id, product_id, (cartErr, cartResults) => {
      if (cartErr) {
        return res.status(500).json({ error: cartErr.message });
      }

      if (cartResults.length > 0) {
        const existingCartItem = cartResults[0];
        const newQuantity = existingCartItem.quantity + quantity;

        if (newQuantity > product.stock) {
          return res.status(400).json({
            message: `Only ${product.stock} item(s) available in stock`
          });
        }

        increaseExistingCartItem(existingCartItem.cart_item_id, quantity, (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
          }

          res.json({
            message: "Cart quantity updated successfully"
          });
        });
      } else {
        if (quantity > product.stock) {
          return res.status(400).json({
            message: `Only ${product.stock} item(s) available in stock`
          });
        }

        addToCart({ user_id, product_id, quantity }, (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.json({
            message: "Item added to cart successfully"
          });
        });
      }
    });
  });
};

const fetchUserCart = (req, res) => {
  const { user_id } = req.params;

  getCartByUser(user_id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
};

const updateCartItem = (req, res) => {
  const { cart_item_id } = req.params;
  const { quantity } = req.body;

  getCartItemById(cart_item_id, (findErr, results) => {
    if (findErr) {
      return res.status(500).json({ error: findErr.message });
    }

    if (!results.length) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const cartItem = results[0];

    if (quantity > cartItem.stock) {
      return res.status(400).json({
        message: `Only ${cartItem.stock} item(s) available in stock`
      });
    }

    updateCartItemQuantity(cart_item_id, quantity, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Cart item updated successfully"
      });
    });
  });
};

const deleteCartItem = (req, res) => {
  const { cart_item_id } = req.params;

  removeCartItem(cart_item_id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Cart item removed successfully"
    });
  });
};

module.exports = {
  addItemToCart,
  fetchUserCart,
  updateCartItem,
  deleteCartItem
};