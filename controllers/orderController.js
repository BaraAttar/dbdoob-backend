const User = require("../models/User.js");
const Order = require("../models/Order.js");
const Product = require("../models/Product.js");

exports.getAllOrders = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 20;
    const skip = (page - 1) * limit;

    // searchs filters
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.customerId) filters.customer = req.query.customerId;
    if (req.query.bookingDate) filters.bookingDate = req.query.bookingDate;
    if (req.query.productId) filters.product = req.query.productId;

    // (1) Fetch the rders with pagination and filters
    const allOrders = await Order.find(filters)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "customer",
        select: "-password",
      })
      .populate("product");

    // (2) Get the total count of Ordes for pagination metadata
    const totalOrders = await Order.countDocuments(filters);

    // (3) Send response with Orders and pagination info
    res.status(200).send({
      orders: allOrders,
      pagination: {
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send({ message: "Error fetching orders" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 20;
    const skip = (page - 1) * limit;

    // searchs filters
    const filters = {};
    if (req.user.id) filters.customer = req.user.id;
    if (req.query.status) filters.status = req.query.status;

    // (1) Fetch the orders with pagination and filters
    const allOrders = await Order.find(filters)
      .skip(skip)
      .limit(limit)
      .populate("product");

    // (2) Get the total count of Ordes for pagination metadata
    const totalOrders = await Order.countDocuments(filters);

    // (3) Send response with orders and pagination info
    res.status(200).send({
      orders: allOrders,
      pagination: {
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send({ message: "Error fetching orders" });
  }
};

exports.getSingleOrder = async (req, res) => {
  // http://localhost:3001/orders/:orderId , http://localhost:3001/orders/${orderId}
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId)

      .populate({
        path: "customer",
        select: "-password",
      })
      .populate("product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).send(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).send({ message: "Error fetching order" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    // (1) Get user details based on email from the request
    const { email } = req.user;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // (2) Destructure order details from the request body and Validate
    const { name, phone, address, details, product, bookingDate } = req.body;
    if (!name || !phone || !address || !details || !product || !bookingDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // (3) Check if the specified product exists
    const isProductExists = await Product.findById(product);
    if (!isProductExists) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // (4) Validate bookingDate format
    if (isNaN(Date.parse(bookingDate))) {
      return res.status(400).json({ message: "Invalid bookingDate format" });
    }
    
    // (5) Create and save the order
    const customer = user._id;
    const order = new Order({
      customer,
      name,
      phone,
      address,
      details,
      product,
      bookingDate: new Date(bookingDate),
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Database error` });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;
    const allowedStatuses = ["pending", "rejected", "accepted"];

    if (!orderId) return res.status(400).send("order id is requred");
    if (!newStatus) return res.status(400).send(" fill status feald");
    if (!allowedStatuses.includes(newStatus))
      return res.status(400).send(`Invalid status use ${allowedStatuses} `);

    const order = await Order.findByIdAndUpdate(
      orderId,
      {status : newStatus },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({
      message: `Order status updated to: ${newStatus}`,
      order: order, 
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "server error" });
  }
};
