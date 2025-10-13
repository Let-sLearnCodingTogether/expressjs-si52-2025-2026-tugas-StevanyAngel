const express = require("express");
const router = express.Router();
const { createApplication, getApplications, getApplication, updateApplication, deleteApplication, getStats } = require("../controllers/applicationController.js");
const { protect } = require("../middleware/auth.js");

// Semua route aplikasi lamaran memerlukan autentikasi
router.use(protect);

// Stats route
router.get("/stats", getStats);

// Main routes
router.route("/").post(createApplication).get(getApplications);

router.route("/:id").get(getApplication).put(updateApplication).delete(deleteApplication);

module.exports = router;
