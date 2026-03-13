const express = require("express");
const router = express.Router();
const aiResponseController = require("../controllers/aiResponseController");
const { protect } = require("../middleware/authMiddleware");

router.get("/history");
router.post("/ask/:id", protect, aiResponseController.ask);
module.exports = router;
//ok
