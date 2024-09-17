const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productList: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  bookingDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartSchema);