const mongoose = require("mongoose");
const aiResponseSchema = new mongoose.Schema({
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "uploadfiles",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});
const AIResponse = new mongoose.model("airesponses", aiResponseSchema);
module.exports = AIResponse;
