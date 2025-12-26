const express = require("express");
const router = express.Router();
const aiResponseController = require("../controllers/aiResponseController");
router.get("/history");
router.post("/ask", aiResponseController.ask);
module.exports = router;
//
