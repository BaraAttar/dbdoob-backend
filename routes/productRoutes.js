const express = require("express");
const router = express.Router();
const upload = require("../Middleware/uploadMiddleware")

const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { adminPermissions } = require("../Middleware/adminPermissions");
// api/product

// admin
router.post("/", adminPermissions, upload.single("file"), addProduct);
router.put("/", adminPermissions, updateProduct);
router.delete("/", adminPermissions, deleteProduct);

// client
router.get("/", getProducts);

module.exports = router;