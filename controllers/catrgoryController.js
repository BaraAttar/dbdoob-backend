const Category = require("../models/Category");

exports.addCategory = async (req, res) => {
  try {
    // (1) Validate category name and status
    const categoryName = req.body.categoryName?.trim();
    const status = req.body.status;

    if (!categoryName || typeof categoryName !== "string") {
      return res
        .status(400)
        .send("Invalid category name: Please provide a string value.");
    }

    if (status !== undefined && typeof status !== "string") {
      return res
        .status(400)
        .json({
          message: "Invalid status: Please provide a valid string value.",
        });
    }

    // (2) Find if category name already exists
    const existsCategory = await Category.findOne({ name: categoryName });
    if (existsCategory) {
      console.log(existsCategory);
      return res.status(409).send({ message: "Category already exists." });
    }

    // (3) Create and save new category
    const newCategory = new Category({
      name: categoryName,
      status: status,
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

    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "name",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $project: {
          name: 1,
          status: 1,
          products: { $size: "$products" },
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
    ]);

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
      { name },
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
