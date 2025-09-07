import express from "express";
import {
  //   addAdmin,
  //   deleteUser,
  //   getAllAdmins,
  //   getAllUsers,
  getUserInfo,
  login,
  logout,
  register,
  //   removeAdmin,
  socialAuth,
  getUserProfile,
  getPurchasedProducts,
  updateUserPoints,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth/isAuthenticated.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", isAuthenticated, logout);
userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.post("/social-auth", socialAuth);

// New endpoints for user profile dashboard
userRouter.get("/profile", isAuthenticated, getUserProfile);
userRouter.get("/purchased-products", isAuthenticated, getPurchasedProducts);
userRouter.put("/update-points", isAuthenticated, updateUserPoints);

export default userRouter;
