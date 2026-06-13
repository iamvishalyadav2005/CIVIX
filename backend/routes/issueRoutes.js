console.log("✅ issueRoutes loaded");
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");
const {
  createIssue,
  getAllIssues,
  getUserIssues,
  getIssueStats,
  updateIssueStatus,
  getIssueById,
  addComment,
  toggleUpvote,
} = require("../controllers/issueController");

// Public routes


// Protected routes
router.use(protect);

router.get("/all", getAllIssues);
router.get("/my-issues", getUserIssues);
router.get("/stats", getIssueStats);

 router.post("/", upload.array("images"), createIssue);
router.post("/:id/comments", addComment);
router.post("/:id/upvote", toggleUpvote);

router.patch("/:issueId/status", updateIssueStatus);

// ⚠️ KEEP THIS LAST
router.get("/:id", getIssueById);

module.exports = router;
