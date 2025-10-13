const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile } = require("../controllers/authController.js");
const { protect } = require("../middleware/auth.js");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Private routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
