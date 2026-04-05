const db = require("../config/db");

const createProduct = (productData, callback) => {
  const sql = `
    INSERT INTO products (product_name, description, price, image_url, stock, category_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      productData.product_name,
      productData.description,
      productData.price,
      productData.image_url,
      productData.stock,
      productData.category_id
    ],
    callback
  );
};

const getAllProducts = (callback) => {
  const sql = "SELECT * FROM products";
  db.query(sql, callback);
};

const updateProduct = (productId, productData, callback) => {
  const sql = `
    UPDATE products
    SET product_name = ?, description = ?, price = ?, image_url = ?, stock = ?, category_id = ?
    WHERE product_id = ?
  `;

  db.query(
    sql,
    [
      productData.product_name,
      productData.description,
      productData.price,
      productData.image_url,
      productData.stock,
      productData.category_id,
      productId
    ],
    callback
  );
};

const deleteProduct = (productId, callback) => {
  const sql = "DELETE FROM products WHERE product_id = ?";
  db.query(sql, [productId], callback);
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
};