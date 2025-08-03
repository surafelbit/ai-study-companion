const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "90d" });
};
exports.registerUser = async function (req, res, next) {
  const { firstName, lastName, password, passwordConfirm, email, phoneNumber } =
    req.body;
  try {
    const user = await Users.findOne({ email: email });
    if (user) {
      res.status(400).json({
        message: "Email already in use",
      });
    } else {
      const user = await Users.create({
        firstName,
        lastName,
        password,
        passwordConfirm,
        email,
        phoneNumber,
      });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Register failed", error: error.message });
  }
};
exports.signIn = async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ message: "there is no user by that email" });
    else {
      const user = await Users.findOne({ email });
      if (!user || (await !Users.comparePassword(password)))
        return res.status(401).json({ message: "Invalid credentials" });
      return res.status(200).json({
        _id: user._id,
        name: user.firstName,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
