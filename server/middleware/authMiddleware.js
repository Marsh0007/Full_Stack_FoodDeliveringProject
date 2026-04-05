const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  console.log("Extracted Token:", token);

  if (!token) {
    return res.status(403).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verify Error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

const isOwnerOrAdmin = (req, res, next) => {
  const requestedUserId = parseInt(req.params.user_id);

  if (req.user.role === "admin" || req.user.user_id === requestedUserId) {
    return next();
  }

  return res.status(403).json({ message: "Access denied" });
};

const isBodyOwnerOrAdmin = (req, res, next) => {
  const requestedUserId = parseInt(req.body.user_id);

  if (req.user.role === "admin" || req.user.user_id === requestedUserId) {
    return next();
  }

  return res.status(403).json({ message: "Access denied" });
};

module.exports = {
  verifyToken,
  isAdmin,
  isOwnerOrAdmin,
  isBodyOwnerOrAdmin
};