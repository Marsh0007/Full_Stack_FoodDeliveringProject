const express = require("express");
const router = express.Router();

const {
  placeOrder,
  fetchOrders,
  fetchUserOrders,
  changeOrderStatus
} = require("../controllers/orderController");

const {
  verifyToken,
  isAdmin,
  isOwnerOrAdmin
} = require("../middleware/authMiddleware");

router.post("/place", verifyToken, placeOrder);
router.get("/all", verifyToken, isAdmin, fetchOrders);
router.get("/user/:user_id", verifyToken, isOwnerOrAdmin, fetchUserOrders);
router.put("/status/:order_id", verifyToken, isAdmin, changeOrderStatus);

module.exports = router;