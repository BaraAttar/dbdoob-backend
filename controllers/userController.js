const User = require("../models/User");
const mongoose = require("mongoose");

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