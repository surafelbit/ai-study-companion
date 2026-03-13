const express = require("express");
const router = express.Router();
const { storage } = require("../utils/cloudinary");
const multer = require("multer");
const upload = multer({ storage });
const fileUploadController = require("../controllers/fileUploadController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/single", authMiddleware.protect, upload.single("file"), fileUploadController.uploader);
router.post("/extract", fileUploadController.extract);
router.get("/", authMiddleware.protect, fileUploadController.getFiles);
//some thing
module.exports = router;
