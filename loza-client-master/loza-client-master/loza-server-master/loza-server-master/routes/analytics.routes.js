import express from "express";
import { isAuthenticated } from "../middlewares/auth/isAuthenticated.js";
import { authorizeRoles } from "../middlewares/auth/authorizeRoles.js";
import {
  getAnalyticsOverview,
  getSalesTrend,
  getTopProducts
} from "../controllers/analytics.controller.js";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/overview",
  isAuthenticated,
  authorizeRoles("owner", "admin"),
  getAnalyticsOverview
);

analyticsRouter.get(
  "/sales-trend",
  isAuthenticated,
  authorizeRoles("owner", "admin"),
  getSalesTrend
);

analyticsRouter.get(
  "/top-products",
  isAuthenticated,
  authorizeRoles("owner", "admin"),
  getTopProducts
);

export default analyticsRouter;
