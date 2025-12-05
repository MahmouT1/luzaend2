import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductsByCategoryName,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "../controllers/product.controller.js";
import { authorizeRoles } from "../middlewares/auth/authorizeRoles.js";
import { isAuthenticated } from "../middlewares/auth/isAuthenticated.js";

const productRouter = express.Router();

productRouter.post(
  "/create-product",
  isAuthenticated,
  authorizeRoles("admin"),
  createProduct
);

productRouter.get("/get-products", getAllProducts);

productRouter.get("/get-products/:categoryName", getProductsByCategoryName);

productRouter.get("/get-single-product/:id", getSingleProduct);

productRouter.get("/search", searchProducts);

productRouter.put(
  "/update-product/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateProduct
);

productRouter.delete(
  "/delete-product/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteProduct
);

export default productRouter;
