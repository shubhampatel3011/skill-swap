var express = require("express");
var router = express.Router();
const feedbackTbl = require("../Models/feedbackTbl");

router.get("/", async (req, res) => {
  try {
    const db = new feedbackTbl();
    const result = await db.GetAllFeedback();
    res.status(200).json({ Message: "Feedback fetched successfully.", List: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/reviewer/:userId", async (req, res) => {
  try {
    const db = new feedbackTbl();
    const result = await db.GetFeedbackByReviewer(req.params.userId);
    res.status(200).json({ Message: "Feedback fetched successfully.", List: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const db = new feedbackTbl();
    const result = await db.GetUserFeedbacks(req.params.userId);
    res.status(200).json({ Message: "Feedback fetched successfully.", List: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const db = new feedbackTbl();
    await db.AddFeedback(req.body);
    res.status(200).json({ Message: "Feedback added successfully." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const db = new feedbackTbl();
    const result = await db.DeleteFeedback(req.params.id);
    res.status(200).json({ Message: "Feedback deleted successfully.", Data: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;