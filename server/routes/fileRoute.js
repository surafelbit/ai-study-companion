const express = require("express");
const router = express.Router();
const { storage } = require("../utils/cloudinary");
const multer = require("multer");
const upload = multer({ storage });
const fileUploadController = require("../controllers/fileUploadController");
router.post("/single", upload.single("file"), fileUploadController.uploader);
router.post("/extract", fileUploadController.extract);
//some thing
module.exports = router;
