import express from "express";
import { isAuthenticated } from "../middlewares/auth/isAuthenticated.js";

const adminRouter = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin role required." });
    }

    next();
  } catch (error) {
    console.log("Admin middleware error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Verify admin access - protected by both authentication and admin role
adminRouter.get("/verify", isAuthenticated, isAdmin, (req, res) => {
  try {
    res.status(200).json({ 
      message: "Admin access verified",
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.log("Admin verification error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default adminRouter;
