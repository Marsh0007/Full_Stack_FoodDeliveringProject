const db = require("../config/db");

const getProductById = (productId, callback) => {
  const sql = `
    SELECT product_id, product_name, stock, price
    FROM products
    WHERE product_id = ?
  `;
  db.query(sql, [productId], callback);
};

const getCartItemByUserAndProduct = (userId, productId, callback) => {
  const sql = `
    SELECT *
    FROM cart_items
    WHERE user_id = ? AND product_id = ?
  `;
  db.query(sql, [userId, productId], callback);
};

const addToCart = (cartData, callback) => {
  const sql = `
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [cartData.user_id, cartData.product_id, cartData.quantity],
    callback
  );
};

const increaseExistingCartItem = (cartItemId, quantity, callback) => {
  const sql = `
    UPDATE cart_items
    SET quantity = quantity + ?
    WHERE cart_item_id = ?
  `;
  db.query(sql, [quantity, cartItemId], callback);
};

const getCartByUser = (userId, callback) => {
  const sql = `
    SELECT 
      cart_items.cart_item_id,
      cart_items.quantity,
      products.product_id,
      products.product_name,
      products.price,
      products.image_url,
      products.stock
    FROM cart_items
    JOIN products ON cart_items.product_id = products.product_id
    WHERE cart_items.user_id = ?
  `;

  db.query(sql, [userId], callback);
};

const getCartItemById = (cartItemId, callback) => {
  const sql = `
    SELECT 
      cart_items.*,
      products.stock,
      products.product_name
    FROM cart_items
    JOIN products ON cart_items.product_id = products.product_id
    WHERE cart_items.cart_item_id = ?
  `;

  db.query(sql, [cartItemId], callback);
};

const updateCartItemQuantity = (cartItemId, quantity, callback) => {
  const sql = `
    UPDATE cart_items
    SET quantity = ?
    WHERE cart_item_id = ?
  `;

  db.query(sql, [quantity, cartItemId], callback);
};

const removeCartItem = (cartItemId, callback) => {
  const sql = `
    DELETE FROM cart_items
    WHERE cart_item_id = ?
  `;

  db.query(sql, [cartItemId], callback);
};

module.exports = {
  getProductById,
  getCartItemByUserAndProduct,
  addToCart,
  increaseExistingCartItem,
  getCartByUser,
  getCartItemById,
  updateCartItemQuantity,
  removeCartItem
};