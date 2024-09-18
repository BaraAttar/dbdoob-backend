const express = require("express");
const router = express.Router();

const { createOrder, getAllOrders , getMyOrders } = require("../controllers/orderController");
const { authToken } = require("../Middleware/auth");
const { adminPermissions } = require("../Middleware/adminPermissions");

// api/orders

// admin
router.get("/", adminPermissions, getAllOrders);

// client
router.post("/", authToken, createOrder);
router.get("/my", authToken, getMyOrders);


// TODO 
// getSingleOrder, updateOrder, updateOrderStatus


module.exports = router;
