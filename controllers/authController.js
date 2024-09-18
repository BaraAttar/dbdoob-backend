const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

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
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.SECRET_KEY
    );


    const userInfo = { ...user._doc };
    delete userInfo.password;

    res.status(200).json({ token , userInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving user" });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already used" });
    }

    // Hash password
    // const hashedPassword = await hashPassword(password);

    const user = new User({ name, email, password });
    const savedUser = await user.save();

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.SECRET_KEY
    );

    const userInfo = { ...user._doc };
    delete userInfo.password;

    // res.status(201).json({ token , userInfo });
    res.status(201).json({ user: userInfo, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during signup" });
  }
};
