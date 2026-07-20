var express = require("express");
var router = express.Router();
const feedbackTbl = require("../Models/feedbackTbl");

// Get all feedback
router.get("/", async (req, res) => {
  try {
    const db = new feedbackTbl();
    const result = await db.GetList();
    res.status(200).json({ Message: "Feedback list fetched.", List: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Submit feedback
router.post("/", async (req, res) => {
  try {
    const db = new feedbackTbl();
    await db.AddFeedback(req.body);
    res.status(200).json({ Message: "Feedback submitted successfully." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update status
router.put("/status/:id", async (req, res) => {
  try {
    const db = new feedbackTbl();
    await db.UpdateStatus(req.params.id, req.body.status);
    res.status(200).json({ Message: "Feedback status updated." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update notes
router.put("/notes/:id", async (req, res) => {
  try {
    const db = new feedbackTbl();
    await db.UpdateNotes(req.params.id, req.body.adminNotes);
    res.status(200).json({ Message: "Admin notes updated." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete feedback
router.delete("/:id", async (req, res) => {
  try {
    const db = new feedbackTbl();
    const result = await db.DeleteFeedback(req.params.id);
    res.status(200).json({ Message: "Feedback deleted.", Data: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
