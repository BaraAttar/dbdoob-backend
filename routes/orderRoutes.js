const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus
} = require("../controllers/orderController");
const { authToken } = require("../Middleware/auth");
const { adminPermissions } = require("../Middleware/adminPermissions");

// api/orders

// admin
router.get("/all", adminPermissions, getAllOrders);

router.put("/status", adminPermissions, updateOrderStatus);

// client
router.post("/", authToken, createOrder);
router.get("/my", authToken, getMyOrders);
router.get("/:id", authToken, getSingleOrder);


module.exports = router;
