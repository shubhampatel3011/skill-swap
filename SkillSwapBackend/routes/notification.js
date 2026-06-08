var express = require("express");
var router = express.Router();
const notificationTbl = require("../Models/notificationTbl");

// Get Notifications
router.get("/:userId", async (req, res) => {
  try {
    const db = new notificationTbl();

    const result = await db.GetNotifications(req.params.userId);

    res.status(200).json({
      Message: "Notifications fetched successfully.",
      List: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add Notification
router.post("/", async (req, res) => {
  try {
    const db = new notificationTbl();

    await db.AddNotification(req.body);

    res.status(200).json({
      Message: "Notification added successfully.",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Mark As Read
router.put("/:id", async (req, res) => {
  try {
    const db = new notificationTbl();

    const result = await db.MarkAsRead(req.params.id);

    res.status(200).json({
      Message: "Notification marked as read.",
      Data: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete Notification
router.delete("/:id", async (req, res) => {
  try {
    const db = new notificationTbl();

    const result = await db.DeleteNotification(req.params.id);

    res.status(200).json({
      Message: "Notification deleted successfully.",
      Data: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
