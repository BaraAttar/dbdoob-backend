const mongoose = require("mongoose");
const { Schema } = mongoose;

const emailRegex =
  /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 20,
  },
  phoneNumber : {
    type : Number,
    required : true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (value) => emailRegex.test(value),
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profileType: {
    type: String,
    enum: ["admin", "employee", "customer"],
    default: "customer",
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
