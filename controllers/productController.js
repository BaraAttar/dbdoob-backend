const Category = require("../models/Category");
const Product = require("../models/Product");
const { uploadImage } = require("../services/cloudinary");

exports.addProduct = async (req, res) => {
  try {
    const { name, description, category, price, cost } = req.body;

    // (0) Check for all required fields
    if (!name || !description || !category || !price || !cost) {
      return res.status(400).json({ message: "All fields are required: name, description, category, price, cost." });
    }

    // (1) Retrieve the list of categories
    const categories = await Category.find();
    const categoriesList = categories.map((cat) => cat.name);

    // Default image URL
    let imageUrl =
      "https://res.cloudinary.com/dkvauszbh/image/upload/v1730245042/package_afdj6n.svg"; 

    // (2) Upload image to Cloudinary if a file is provided in the request
    if (req.file) {
      const uploadResult = await uploadImage(req.file);
      if (!uploadResult || !uploadResult.secure_url) {
        return res.status(500).json({ message: "Failed to upload image" });
      }
      imageUrl = uploadResult.secure_url; // تحديث imageUrl إذا تمت عملية الرفع بنجاح
    }

    // (3) Create product if category exists
    if (categoriesList.includes(category)) {
      const product = new Product({
        name,
        description,
        category,
        price,
        cost,
        image: imageUrl,
      });

      await product.save();
      res.status(201).json(product);
    } else {
      res.status(404).send("Category not found");
    }
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.query.id;
    const { name, description, category, image } = req.body;

    // (1) get catedories list
    const categories = await Category.find();
    const categoriesList = categories.map((cat) => cat.name);

    // (2) creat product with existed catedory
    if (!categoriesList.includes(category)) {
      return res.status(404).send("category not found");
    }

    // (3) find and update the product
    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        category,
        image,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Procuct updated successfully",
      product: updateProduct,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Error fetching products", error });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, name } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query object based on the provided filters
    let query = {};
    if (category) {
      query.category = category;
    }
    if (name) {
      query.name = { $regex: new RegExp(name, "i") }; // Case-insensitive search
    }

    // Fetch the products with pagination and filters
    const allProducts = await Product.find(query).skip(skip).limit(limit);

    // Get the total count of products for pagination metadata
    const totalProducts = await Product.countDocuments(query);

    // Send response with products and pagination info
    res.status(200).send({
      products: allProducts,
      pagination: {
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        limit,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Error fetching products", error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.query.id;
    if (!productId) {
      return res.status(400).send("product ID is required.");
    }

    // (1) finde
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("product not found.");
    }

    // (2) delete
    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully.", product });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Error fetching products", error });
  }
};
