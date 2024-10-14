const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

exports.logIn = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const user = await User.findOne({ $or: [{ email }, { userName }] });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // const isMatch = await compare(password, user.password);

    if (password != user.password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }

    );

    const userInfo = { ...user._doc };
    delete userInfo.password;

    res.status(200).json({ token, user : userInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving user" });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { firstName, lastName, userName, phoneNumber, email, password } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !userName ||
      !phoneNumber ||
      !email ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or Username already used" });
    }

    const user = new User({
      firstName,
      lastName,
      userName,
      phoneNumber,
      email,
      password,
    });
    await user.save();

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    const { password: _, ...userInfo } = user._doc;

    // res.status(201).json({ token , userInfo });
    res.status(201).json({ user: userInfo, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during signup" });
  }
};
