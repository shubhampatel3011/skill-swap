var express = require("express");
var router = express.Router();
const subCategoryTbl = require("../Models/subCategoryTbl");

router.get("/", async (req, res) => {
  try {
    const db = new subCategoryTbl();
    const result = await db.GetList();

    res.status(200).json({
      Message: "Category list fetched successfully.",
      List: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = new subCategoryTbl();
    const result = await db.GetById(req.params.id);

    res.status(200).json({
      Data: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const db = new subCategoryTbl();
    await db.AddSubCategory(req.body);

    res.status(200).json({
      Message: "SubCategory added successfully.",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const db = new subCategoryTbl();
    const result = await db.UpdateSubCategory(req.params.id, req.body);

    res.status(200).json({
      Data: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const db = new subCategoryTbl();
    const result = await db.DeleteSubCategory(req.params.id);

    res.status(200).json({
      Data: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
