const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
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
    },
    passwordConfirm: {
      type: String,
      minlength: 6,
    },
    profileImage: {
      type: String,
    },
    role: { type: String, enum: ["admin", "student"], default: "student" },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};
const Users = new mongoose.model("users", userSchema);
module.exports = Users;
