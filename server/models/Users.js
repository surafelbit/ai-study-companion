const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: 3,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      minlength: 3,
      trim: true,
    },
    phoneNumber: {
      type: String,
      minlength: 10,
      validate: {
        validator: function (value) {
          return /^\+251(9|7)\d{8}$/.test(value);
        },
        message: (props) => `${props.value} is not valid phone number`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: [true, "email must be unique"],
      lowercase: true,
      validate: { validator: validator.isEmail, message: "invalid email" },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    passwordConfirm: {
      type: String,
      minlength: 6,
      validate: {
        validator: function (el) {
          return !this.isModified("password") || this.password === el;
        },
        message: "The password doesnt match",
      },
      required: [true, "Please confirm your password"],
    },
    profileImage: {
      type: String,
    },
    role: { type: String, enum: ["admin", "student"], default: "student" },
    passwordResetToken: String,
    passwordResetExpires: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyToken: String,
    verifyTokenExpires: Date,
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};
userSchema.methods.resetPassword = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // valid for 10 mins
  return resetToken;
};
const Users = new mongoose.model("users", userSchema);
module.exports = Users;
