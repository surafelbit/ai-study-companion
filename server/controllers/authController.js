const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Uploads } = require("openai/resources/index");
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
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (!email)
      return res
        .status(400)
        .json({ message: "there is no user by that email" });
    else {
      const user = await Users.findOne({ email });
      if (!user || (await !user.comparePassword(password)))
        return res.status(401).json({ message: "Invalid credentials" });
      else {
        return res.status(200).json({
          _id: user._id,
          name: user.firstName + " " + user.lastName,
          email: user.email,
          token: generateToken(user._id),
        });
      }
    }
  } catch {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
exports.forgotPassword = async function (req, res) {
  const { email } = req.body;
  const user = await Users.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "there is no user by that email" });
  const resetToken = user.resetPassword();
  await user.save({ validateBeforeSave: false });
  const resetURL = `http://localhost:3000/${resetToken}`;
  res.status(200).json({
    message: "reset token is sent",
    resetURL,
  });
};
exports.resetPassword = async function (req, res) {
  const { password, passwordConfirm } = req.body;
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await Users.findOne({
    passowrdResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  user.password = password;
  (user.passwordConfirm = passwordConfirm),
    (user.passowrdResetToken = undefined),
    (user.passwordResetExpires = undefined);
  await user.save();
  const token = generateToken(user._id);
  res.status(200).json({ message: "password reset succesfully", token });
};
