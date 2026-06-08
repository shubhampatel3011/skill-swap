var express = require("express");
var router = express.Router();
const messageTbl = require("../Models/messageTbl");

// Get Messages By Swap Id
router.get("/:swapId", async (req, res) => {
  try {
    const db = new messageTbl();

    const result = await db.GetMessagesBySwap(req.params.swapId);

    res.status(200).json({
      Message: "Messages fetched successfully.",
      List: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add Message
router.post("/", async (req, res) => {
  try {
    const db = new messageTbl();

    await db.AddMessage(req.body);

    res.status(200).json({
      Message: "Message sent successfully.",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete Message
router.delete("/:id", async (req, res) => {
  try {
    const db = new messageTbl();

    const result = await db.DeleteMessage(req.params.id);

    res.status(200).json({
      Message: "Message deleted successfully.",
      Data: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
