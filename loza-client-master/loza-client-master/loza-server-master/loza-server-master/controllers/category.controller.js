import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";

// ADD CATEGORIES
export const addCategory = async (req, res) => {
  try {
    const { category } = req.body;

    const existingCategory = await Category.findOne({ name: category });
    if (existingCategory) {
      return res.status(400).json({
        message: "Category name already exists",
      });
    }

    await Category.create({ name: category });
    return res.status(201).json({
      message: "Category Added Successfully",
    });
  } catch (error) {
    console.log("category controller error (addCategory):", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// EDIT CATEGORY
export const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !id) {
      return res
        .status(400)
        .json({ message: "Category id and name are required" });
    }

    const existingCategory = await Category.findOne({ name, _id: { $ne: id } });
    if (existingCategory) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
    });
  } catch (error) {
    console.log("category controller error (editCategory):", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // 1- check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 2- remove the category
    await Category.findByIdAndDelete(id);

    // 3- update all products that had this category
    await Product.updateMany(
      { category: id }, // condition
      { $unset: { category: "" } } // remove the field
      // OR { $set: { category: null } } لو عايز يبقى null
    );

    res.status(200).json({ message: "Category deleted & products updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      categories,
    });
  } catch (error) {
    console.log("category controller error (getCategories) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
