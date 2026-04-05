const express = require("express");
const router = express.Router();

const {
  addProduct,
  fetchProducts,
  editProduct,
  removeProduct
} = require("../controllers/productController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/all", fetchProducts);

router.post("/add", verifyToken, isAdmin, addProduct);
router.put("/update/:id", verifyToken, isAdmin, editProduct);
router.delete("/delete/:id", verifyToken, isAdmin, removeProduct);

module.exports = router;