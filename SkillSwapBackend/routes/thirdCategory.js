var express = require("express");
var router = express.Router();
const thirdCategoryTbl = require("../Models/thirdCategoryTbl");

// Get all third categories
router.get("/", async (req, res) => {
  try {
    const db = new thirdCategoryTbl();
    const result = await db.GetList();

    res.status(200).json({
      Message: "Third Categories fetched successfully.",
      List: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: e.message,
    });
  }
});

// Get third category by id
router.get("/:id", async (req, res) => {
  try {
    const db = new thirdCategoryTbl();
    const result = await db.GetById(req.params.id);

    res.status(200).json({
      Message: "Third Category fetched successfully.",
      Data: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: e.message,
    });
  }
});

// Add third category
router.post("/", async (req, res) => {
  try {
    const db = new thirdCategoryTbl();
    await db.AddThirdCategory(req.body);

    res.status(200).json({
      Message: "Third Category added successfully.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: e.message,
    });
  }
});

// Update third category
router.put("/:id", async (req, res) => {
  try {
    const db = new thirdCategoryTbl();
    const result = await db.UpdateThirdCategory(req.params.id, req.body);

    res.status(200).json({
      Message: "Third Category updated successfully.",
      Data: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: e.message,
    });
  }
});

// Delete third category
router.delete("/:id", async (req, res) => {
  try {
    const db = new thirdCategoryTbl();
    const result = await db.DeleteThirdCategory(req.params.id);

    res.status(200).json({
      Message: "Third Category deleted successfully.",
      Data: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: e.message,
    });
  }
});

module.exports = router;