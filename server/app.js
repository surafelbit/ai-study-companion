const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
dotenv.config();
connectDB();
// const mongoSanitize = require("express-mongo-sanitize");
// const rateLimit = require("express-rate-limit");
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "request limit passed. Try again an hour later",
// });
// app.use(limiter);
// app.use(mongoSanitize());

app.use(express.json());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
module.exports = app;
