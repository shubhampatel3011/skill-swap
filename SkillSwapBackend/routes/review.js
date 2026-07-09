var express = require("express");
var router = express.Router();
const reviewTbl = require("../Models/reviewTbl");

// Get All Reviews
router.get("/", async (req, res) => {
  try {
    const db = new reviewTbl();
    const result = await db.GetAllReviews();
    res.status(200).json({ Message: "Reviews fetched successfully.", List: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get Reviews Written By A User (Given)
router.get("/reviewer/:userId", async (req, res) => {
  try {
    const db = new reviewTbl();
    const result = await db.GetReviewsByReviewer(req.params.userId);
    res.status(200).json({ Message: "Reviews fetched successfully.", List: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get Reviews By User (Received)
router.get("/:userId", async (req, res) => {
  try {
    const db = new reviewTbl();

    const result = await db.GetUserReviews(req.params.userId);

    res.status(200).json({
      Message: "Reviews fetched successfully.",
      List: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add Review
router.post("/", async (req, res) => {
  try {
    const db = new reviewTbl();

    await db.AddReview(req.body);

    res.status(200).json({
      Message: "Review added successfully.",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete Review
router.delete("/:id", async (req, res) => {
  try {
    const db = new reviewTbl();

    const result = await db.DeleteReview(req.params.id);

    res.status(200).json({
      Message: "Review deleted successfully.",
      Data: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
