const db = require("../config/db");

const createCategory = (categoryName, callback) => {
  const sql = "INSERT INTO categories (category_name) VALUES (?)";
  db.query(sql, [categoryName], callback);
};

const getCategories = (callback) => {
  const sql = "SELECT * FROM categories";
  db.query(sql, callback);
};

module.exports = {
  createCategory,
  getCategories
};