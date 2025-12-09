import express from "express";
import {
  addCategory,
  deleteCategory,
  editCategory,
  getCategories,
} from "../controllers/category.controller.js";
import { isAuthenticated } from "../middlewares/auth/isAuthenticated.js";
import { authorizeRoles } from "../middlewares/auth/authorizeRoles.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/add-category",
  isAuthenticated,
  authorizeRoles("admin"),
  addCategory
);

categoryRouter.put(
  "/update-category/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCategory
);

categoryRouter.delete(
  "/delete-category/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCategory
);

categoryRouter.get("/get-categories", getCategories);

export default categoryRouter;
