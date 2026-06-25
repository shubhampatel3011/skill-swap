var express = require("express");
var router = express.Router();
const swapTbl = require("../Models/swapTbl");

// Get All Requests
router.get("/", async (req, res) => {
  try {
    const db = new swapTbl();
    const result = await db.GetList();

    res.status(200).json({
      Message: "Requests fetched successfully.",
      List: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get Request By Id
router.get("/:id", async (req, res) => {
  try {
    const db = new swapTbl();
    const result = await db.GetById(req.params.id);

    res.status(200).json({
      Message: "Request fetched successfully.",
      Data: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add Request
router.post("/", async (req, res) => {
  try {
    const db = new swapTbl();
    await db.AddRequest(req.body);

    res.status(200).json({
      Message: "Swap request sent successfully.",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update Status
router.put("/:id/status", async (req, res) => {
  try {
    const db = new swapTbl();

    await db.UpdateStatus(
      req.params.id,
      req.body.status
    );

    res.status(200).json({
      message: "Status updated"
    });
  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
});

// Delete Request
router.delete("/:id", async (req, res) => {
  try {
    const db = new swapTbl();

    const result = await db.DeleteRequest(req.params.id);

    res.status(200).json({
      Message: "Request deleted successfully.",
      Data: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
