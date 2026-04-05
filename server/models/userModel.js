const db = require("../config/db");

const createUser = (userData, callback) => {
  const sql = `
    INSERT INTO users (full_name, email, password, phone, address, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      userData.full_name,
      userData.email,
      userData.password,
      userData.phone,
      userData.address,
      userData.role || "customer"
    ],
    callback
  );
};

const findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

const findUserById = (userId, callback) => {
  const sql = `
    SELECT user_id, full_name, email, phone, address, role, created_at
    FROM users
    WHERE user_id = ?
  `;
  db.query(sql, [userId], callback);
};

const updateUserProfile = (userId, full_name, email, phone, address, callback) => {
  const sql = `
    UPDATE users
    SET full_name = ?, email = ?, phone = ?, address = ?
    WHERE user_id = ?
  `;
  db.query(sql, [full_name, email, phone, address, userId], callback);
};

const getUserPasswordById = (userId, callback) => {
  const sql = "SELECT password FROM users WHERE user_id = ?";
  db.query(sql, [userId], callback);
};

const updateUserPassword = (userId, hashedPassword, callback) => {
  const sql = "UPDATE users SET password = ? WHERE user_id = ?";
  db.query(sql, [hashedPassword, userId], callback);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserProfile,
  getUserPasswordById,
  updateUserPassword
};