const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
} = require("../models/productModel");

const addProduct = (req, res) => {
  createProduct(req.body, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Product added successfully" });
  });
};

const fetchProducts = (req, res) => {
  getAllProducts((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
};

const editProduct = (req, res) => {
  const productId = req.params.id;

  updateProduct(productId, req.body, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Product updated successfully" });
  });
};

const removeProduct = (req, res) => {
  const productId = req.params.id;

  deleteProduct(productId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Product deleted successfully" });
  });
};

module.exports = {
  addProduct,
  fetchProducts,
  editProduct,
  removeProduct
};