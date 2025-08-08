const mongoose = require("mongoose");
const uploadFileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  fileName: String,
  fileUrl: { type: String, required: true },
  fileType: String,
  extractedText: String,
  uploadedAt: { type: Date, default: Date.now },
  summary: String,
});
const upLoadFile = new mongoose.model("uploadfiles", uploadFileSchema);
module.exports = upLoadFile;
