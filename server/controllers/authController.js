const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserProfile,
  updateUserPassword
} = require("../models/userModel");

const registerUser = async (req, res) => {
  const { full_name, email, password, phone, address } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  createUser(
    {
      full_name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: "customer"
    },
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "User registered successfully"
      });
    }
  );
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  });
};

const getProfile = (req, res) => {
  const userId = req.params.user_id;

  findUserById(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  });
};

const updateProfile = (req, res) => {
  const { user_id, full_name, email, phone, address } = req.body;

  updateUserProfile(
    user_id,
    full_name,
    email,
    phone,
    address,
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Profile updated successfully"
      });
    }
  );
};

const resetPassword = async (req, res) => {
  const { user_id, currentPassword, newPassword } = req.body;

  findUserById(user_id, async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    findUserByEmail(results[0].email, async (err2, userResults) => {
      if (err2) {
        return res.status(500).json({ error: err2.message });
      }

      const user = userResults[0];

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Current password incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      updateUserPassword(user_id, hashedPassword, (err3) => {
        if (err3) {
          return res.status(500).json({ error: err3.message });
        }

        res.json({
          message: "Password updated successfully"
        });
      });
    });
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  resetPassword
};