const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  resetPassword
} = require("../controllers/authController");

const {
  verifyToken,
  isOwnerOrAdmin,
  isBodyOwnerOrAdmin
} = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile/:user_id", verifyToken, isOwnerOrAdmin, getProfile);
router.put("/update-profile", verifyToken, isBodyOwnerOrAdmin, updateProfile);
router.put("/reset-password", verifyToken, isBodyOwnerOrAdmin, resetPassword);

module.exports = router;