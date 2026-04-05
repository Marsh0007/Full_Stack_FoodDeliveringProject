const db = require("../config/db");

const createOrder = (connection, orderData, callback) => {
  const sql = `
    INSERT INTO orders (user_id, total_amount, delivery_address, order_status)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [
      orderData.user_id,
      orderData.total_amount,
      orderData.delivery_address,
      orderData.order_status || "Pending"
    ],
    callback
  );
};

const addOrderItem = (connection, orderItemData, callback) => {
  const sql = `
    INSERT INTO order_items (order_id, product_id, quantity, subtotal)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [
      orderItemData.order_id,
      orderItemData.product_id,
      orderItemData.quantity,
      orderItemData.subtotal
    ],
    callback
  );
};

const createPayment = (connection, paymentData, callback) => {
  const sql = `
    INSERT INTO payments (order_id, payment_method, payment_status)
    VALUES (?, ?, ?)
  `;

  connection.query(
    sql,
    [
      paymentData.order_id,
      paymentData.payment_method,
      paymentData.payment_status || "Pending"
    ],
    callback
  );
};

const getAllOrders = (callback) => {
  const sql = `
    SELECT orders.*, users.full_name
    FROM orders
    JOIN users ON orders.user_id = users.user_id
    ORDER BY orders.created_at DESC
  `;

  db.query(sql, callback);
};

const getCartByUser = (userId, callback) => {
  const sql = `
    SELECT 
      cart_items.cart_item_id,
      cart_items.product_id,
      cart_items.quantity,
      products.product_name,
      products.price,
      products.stock,
      (cart_items.quantity * products.price) AS subtotal
    FROM cart_items
    JOIN products ON cart_items.product_id = products.product_id
    WHERE cart_items.user_id = ?
  `;

  db.query(sql, [userId], callback);
};

const clearCartByUser = (connection, userId, callback) => {
  const sql = `
    DELETE FROM cart_items
    WHERE user_id = ?
  `;

  connection.query(sql, [userId], callback);
};

const decreaseProductStock = (connection, productId, quantity, callback) => {
  const sql = `
    UPDATE products
    SET stock = stock - ?
    WHERE product_id = ? AND stock >= ?
  `;

  connection.query(sql, [quantity, productId, quantity], callback);
};

const getOrdersByUser = (userId, callback) => {
  const sql = `
    SELECT *
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], callback);
};

const updateOrderStatus = (orderId, status, callback) => {
  const sql = `
    UPDATE orders
    SET order_status = ?
    WHERE order_id = ?
  `;

  db.query(sql, [status, orderId], callback);
};

module.exports = {
  db,
  createOrder,
  addOrderItem,
  createPayment,
  getAllOrders,
  getCartByUser,
  clearCartByUser,
  decreaseProductStock,
  getOrdersByUser,
  updateOrderStatus
};