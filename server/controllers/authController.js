const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Uploads } = require("openai/resources/index");
const sendEmail = require("../utils/sendEmail");
const { emit } = require("process");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "90d" });
};
exports.registerUser = async function (req, res, next) {
  const { firstName, lastName, password, passwordConfirm, email, phoneNumber } =
    req.body;
  try {
    const users = await Users.findOne({ email: email });
    if (users) {
      res.status(400).json({
        message: "Email already in use",
      });
    } else {
      const user = await Users.create({
        firstName,
        lastName,
        password,
        passwordConfirm: passwordConfirm,
        email,
        phoneNumber,
        isVerified: true,
      });

      user.passwordConfirm = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(201).json({
        _id: user._id,
        name: user.firstName,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (
  error
  // res.status(500).json({ message: "Register failed", error: error.message });
  ) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((el) => el.message);
      return res.status(400).json({
        message: "Validation failed",
        errors, // array of validation error messages
      });
    }

    // Handle duplicate key error (unique email)
    if (error.code && error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Other errors
    return res
      .status(500)
      .json({ message: "Register failed", error: error.message });
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

    if (!email) {
      return res
        .status(400)
        .json({ message: "there is no user by that email" });
    } else {
      const user = await Users.findOne({ email }).select("+password");
      if (!user || !(await user.comparePassword(password)))
        return res.status(401).json({ message: "Invalid credentials" });
      else {
        return res.status(200).json({
          _id: user._id,
          name: user.firstName,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
exports.forgotPassword = async function (req, res) {
  const { email } = req.body;
  const user = await Users.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "there is no user by that email" });
  const resetToken = user.resetPassword();
  await user.save({ validateBeforeSave: false });
  const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
  sendEmail({
    receiver: user.email,
    subject: "nice email",
    text: "this is also nice",
    message: `<div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p>Hi ${user.firstName || "there"},</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <a href="${resetURL}"
      style="display: inline-block; padding: 10px 20px; background: #007BFF; color: white; text-decoration: none; border-radius: 5px;">
     Reset Password
   </a>
      <p style="margin-top: 20px; font-size: 12px; color: #777;">This link will expire in 10 minutes.</p>
    </div>
  </div>`,
  });
  res.status(200).json({
    message: "reset token is sent",
    resetURL,
  });
};
exports.resetPassword = async function (req, res) {
  try {
    const { password, passwordConfirm } = req.body;
    const hashToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await Users.findOne({
      passwordResetToken: hashToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (user) {
      user.password = password;
      (user.passwordConfirm = passwordConfirm),
        (user.passowrdResetToken = undefined),
        (user.passwordResetExpires = undefined);
      await user.save();

      const token = generateToken(user._id);
      res.status(200).json({ message: "password reset succesfully", token });
    } else {
      res.status(400).json({ message: "Invalid or expired token" });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((el) => el.message);
      return res.status(400).json({
        message: "Validation failed",
        errors, // array of validation error messages
      });
    }
  }
};
