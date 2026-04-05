const { createCategory, getCategories } = require("../models/categoryModel");

const addCategory = (req, res) => {
  const { category_name } = req.body;

  createCategory(category_name, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Category added successfully"
    });
  });
};

const fetchCategories = (req, res) => {
  getCategories((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
};

module.exports = {
  addCategory,
  fetchCategories
};