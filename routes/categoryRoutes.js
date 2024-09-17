const express = require("express");
const router = express.Router();

const { adminPermissions } = require("../Middleware/adminPermissions");

const {
  showCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/catrgoryController");

// client
router.get("/", showCategories);

// admin
router.post("/", adminPermissions, addCategory);
router.put("/", adminPermissions, updateCategory);
router.delete("/", adminPermissions, deleteCategory);

module.exports = router;
