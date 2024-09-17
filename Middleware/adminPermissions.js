const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.adminPermissions = async (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    const { id } = decoded;  // Extract user ID from decoded token
    const user = await User.findById(id);  // Get user from database
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.profileType === "admin") {
      next();  // Allow access
    } else {
      return res.status(403).json({ message: "You do not have permission." });
    }
  });
};
