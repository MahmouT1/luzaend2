import { User } from "../../models/user.model.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    console.log("🔐 Authentication middleware called for:", req.path);
    const token = req.cookies.jwt;
    console.log("🍪 Token present:", !!token);

    if (!token) {
      console.log("❌ No token found - returning 401");
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Use fallback value for development if environment variable is not set
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';

    const decoded = jwt.verify(token, jwtSecret);
    console.log("✅ Token decoded successfully for user:", decoded.userId);

    const user = await User.findById(decoded.userId);
    console.log("👤 User found:", !!user, user?.role);

    if (!user) {
      console.log("❌ User not found - returning 401");
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    console.log("✅ Authentication successful, proceeding to next middleware");
    next();
  } catch (error) {
    console.log("auth middleware error (isAuthenticated) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
