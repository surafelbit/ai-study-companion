const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
router.post("/register", authController.registerUser);
router.post("/login", authController.signIn);
router.post("/forgotpassword", authController.forgotPassword);
router.post("/resetpassword/:token", authController.resetPassword);
router.get("/verifyemail/:token", authController.verifyEmail);
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});
router.post("/resend-verification", authController.resendToken);
module.exports = router; //
