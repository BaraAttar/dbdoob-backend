const express = require("express");
const router = express.Router();

const { createOrder, getAllOrders , getMyAllOrders } = require("../controllers/orderController");
const { authToken } = require("../Middleware/auth");
const { adminPermissions } = require("../Middleware/adminPermissions");

// api/order
router.post("/", authToken, createOrder);

router.get("/", adminPermissions, getAllOrders);

router.get("/myorders", authToken, getMyAllOrders);

// router 
//   .route("/:id")
//   .get(authenticateUser, getSingleOrder)
//   .patch(authenticateUser, updateOrder);

module.exports = router;
