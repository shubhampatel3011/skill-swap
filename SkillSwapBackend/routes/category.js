var express = require("express");
var router = express.Router();
const categoryTbl = require("../Models/categoryTbl");

router.get("/", async (req, res) => {
  try {
    const db = new categoryTbl();
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
    const db = new categoryTbl();
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
    const db = new categoryTbl();
    await db.AddCategory(req.body);

    res.status(200).json({
      Message: "Category added successfully.",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const db = new categoryTbl();
    const result = await db.UpdateCategory(
      req.params.id,
      req.body
    );

    res.status(200).json({
      Data: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const db = new categoryTbl();
    const result = await db.DeleteCategory(
      req.params.id
    );

    res.status(200).json({
      Data: result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;