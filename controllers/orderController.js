const jwt = require("jsonwebtoken");

const User = require("../models/User.js");
const Order = require("../models/Order.js");

exports.getAllOrders = async (req, res) => {
  res.send("Get all orders")
}

exports.getMyAllOrders = async (req, res) => {
  console.log(req.user.id)
  res.send(`Get my all orders`)
}

exports.createOrder = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { product, quantity } = req.body;
    const customer  = user._id;

    const order = new Order({customer , product , quantity})
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving order" });
  }
};
