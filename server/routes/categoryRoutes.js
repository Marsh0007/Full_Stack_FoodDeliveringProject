const express = require("express");
const router = express.Router();

const {
  addCategory,
  fetchCategories
} = require("../controllers/categoryController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/add", verifyToken, isAdmin, addCategory);
router.get("/all", fetchCategories);

module.exports = router;