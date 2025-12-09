import express from "express";
import { isAuthenticated } from "../middlewares/auth/isAuthenticated.js";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getInvoice,
} from "../controllers/order.controller.js";
import { quantityChecker } from "../middlewares/quantityChecker.js";
import { authorizeRoles } from "../middlewares/auth/authorizeRoles.js";

const orderRouter = express.Router();

orderRouter.post("/create-order", quantityChecker, createOrder);

orderRouter.put(
  "/update-order-status/:id",
  isAuthenticated,
  authorizeRoles("owner", "admin"),
  updateOrderStatus
);

orderRouter.delete(
  "/delete-order/:id",
  isAuthenticated,
  authorizeRoles("owner", "admin"),
  deleteOrder
);

orderRouter.get(
  "/get-orders",
  isAuthenticated,
  authorizeRoles("owner", "admin"),
  getAllOrders
);

orderRouter.get(
  "/get-order/:id",
  isAuthenticated,
  authorizeRoles("owner", "admin"),
  getOrderById
);

orderRouter.get(
  "/invoice/:orderId",
  isAuthenticated,
  getInvoice
);

orderRouter.post("/quantity-checker", quantityChecker);
export default orderRouter;
