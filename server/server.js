const express = require("express");
// const app = express();
const app = require("./app");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
dotenv.config({ path: "./.env" });
app.listen(PORT, () => {
  console.log("server started listening on port 5000");
});

// mongoose
//   .connect()
//   .then(() => {
//     console.log("☑️soon to connect to the database");
//   })
//   .catch(() => {});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhandled rejections reached here");
  process.exit[1];
});
