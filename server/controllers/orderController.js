const {
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
} = require("../models/orderModel");

const placeOrder = (req, res) => {
  const { user_id, delivery_address, payment_method } = req.body;

  getCartByUser(user_id, (cartErr, cartItems) => {
    if (cartErr) {
      return res.status(500).json({ error: cartErr.message });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const outOfStockItem = cartItems.find((item) => item.quantity > item.stock);

    if (outOfStockItem) {
      return res.status(400).json({
        message: `${outOfStockItem.product_name} has only ${outOfStockItem.stock} item(s) left in stock`
      });
    }

    const total_amount = cartItems.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0
    );

    db.beginTransaction((transactionErr) => {
      if (transactionErr) {
        return res.status(500).json({ error: transactionErr.message });
      }

      createOrder(
        db,
        {
          user_id,
          total_amount,
          delivery_address,
          order_status: "Pending"
        },
        (orderErr, orderResult) => {
          if (orderErr) {
            return db.rollback(() => {
              res.status(500).json({ error: orderErr.message });
            });
          }

          const order_id = orderResult.insertId;
          let completedItems = 0;
          let hasFailed = false;

          cartItems.forEach((item) => {
            decreaseProductStock(db, item.product_id, item.quantity, (stockErr, stockResult) => {
              if (hasFailed) return;

              if (stockErr || stockResult.affectedRows === 0) {
                hasFailed = true;
                return db.rollback(() => {
                  res.status(400).json({
                    message: `${item.product_name} is no longer available in the requested quantity`
                  });
                });
              }

              addOrderItem(
                db,
                {
                  order_id,
                  product_id: item.product_id,
                  quantity: item.quantity,
                  subtotal: item.subtotal
                },
                (itemErr) => {
                  if (hasFailed) return;

                  if (itemErr) {
                    hasFailed = true;
                    return db.rollback(() => {
                      res.status(500).json({ error: itemErr.message });
                    });
                  }

                  completedItems++;

                  if (completedItems === cartItems.length) {
                    createPayment(
                      db,
                      {
                        order_id,
                        payment_method,
                        payment_status:
                          payment_method === "Cash on Delivery" ? "Pending" : "Paid"
                      },
                      (paymentErr) => {
                        if (paymentErr) {
                          return db.rollback(() => {
                            res.status(500).json({ error: paymentErr.message });
                          });
                        }

                        clearCartByUser(db, user_id, (clearErr) => {
                          if (clearErr) {
                            return db.rollback(() => {
                              res.status(500).json({ error: clearErr.message });
                            });
                          }

                          db.commit((commitErr) => {
                            if (commitErr) {
                              return db.rollback(() => {
                                res.status(500).json({ error: commitErr.message });
                              });
                            }

                            res.json({
                              message: "Order placed successfully",
                              order_id
                            });
                          });
                        });
                      }
                    );
                  }
                }
              );
            });
          });
        }
      );
    });
  });
};

const fetchOrders = (req, res) => {
  getAllOrders((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
};

const fetchUserOrders = (req, res) => {
  const { user_id } = req.params;

  getOrdersByUser(user_id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
};

const changeOrderStatus = (req, res) => {
  const { order_id } = req.params;
  const { order_status } = req.body;

  updateOrderStatus(order_id, order_status, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Order status updated successfully"
    });
  });
};

module.exports = {
  placeOrder,
  fetchOrders,
  fetchUserOrders,
  changeOrderStatus
};