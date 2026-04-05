const express = require("express");
const router = express.Router();

const {
  addItemToCart,
  fetchUserCart,
  updateCartItem,
  deleteCartItem
} = require("../controllers/cartController");

router.post("/add", addItemToCart);
router.get("/:user_id", fetchUserCart);
router.put("/update/:cart_item_id", updateCartItem);
router.delete("/remove/:cart_item_id", deleteCartItem);

module.exports = router;