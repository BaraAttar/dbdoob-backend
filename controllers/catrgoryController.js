const Category = require("../models/Category");

exports.addCategory = async (req, res) => {
  try {
    //(1) Validate category name
    if (!req.body.categoryName || typeof req.body.categoryName !== "string") {
      return res
        .status(400)
        .send("Invalid category name: Please provide a string value.");
    }

    // (2) Find if category name already exists
    const existsCategory = await Category.find({ name: req.body.categoryName });
    if (existsCategory) {
      return res.status(409).send({ message: "Category already exists." });
    }

    // (3) Find the category with the highest order
    const highestOrderCategory = await Category.findOne().sort({ order: -1 });

    // (4) Set the new category's order
    const newOrder = highestOrderCategory ? highestOrderCategory.order + 1 : 1;

    // (5) Create and save new category
    const newCategory = new Category({
      name: req.body.categoryName,
      status: req.body.status,
      order: newOrder,
    });
    await newCategory.save();

    res.status(201).send("Category added successfully.");
    console.log(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

exports.showCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (categories.length === 0) {
      res.status(404).send("No categories found.");
    } else {
      res.json(categories);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: `Database error: ${error.message}` });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.query.id;

    if (!categoryId) {
      return res.status(400).send("Category ID is required.");
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).send("Category not found.");
    }

    await category.deleteOne();

    res.send("Category deleted successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: `Database error: ${error.message}` });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.query.id;
    const { name } = req.body;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required." });
    }

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {name},
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res
      .status(500)
      .json({ message: `Database error: ${error.message}` });
  }
};
