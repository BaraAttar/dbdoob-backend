const User = require("../models/User");
const mongoose = require("mongoose");

// TODO search by name

exports.getUsers = async (req, res) => {
  try {
    const { userId } = req.query;

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send("Invalid user ID");
      }

      const user = await User.find({ _id: userId }).select("-password");
      if (!user) return res.status(404).send("User not found");
      return res.status(200).send(user);
    }

    const users = await User.find().select("-password");
    if (!users || users.length === 0)
      return res.status(404).send("No users found");

    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
};

exports.restoreUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(400).json({ message: "Invalid request, user not provided" });
    }

    const restoredUser = await User.findById(user.id).select("-password")

    if (!restoredUser) {
      res.status(404).send("user not found")
    }

    return res.status(200).json(restoredUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
};
