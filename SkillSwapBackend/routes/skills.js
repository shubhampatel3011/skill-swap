var express = require("express");
var router = express.Router();
const skillTbl = require("../Models/skillTbl");

// GET skills listing. 
router.get("/", async (req, res, next) => {
  try {
    const db = new skillTbl();
    const result = await db.GetList();
    res.status(200).json({
      Message: "skillTbl data is fetched successfully.",
      List: result,
    });
  } catch (e) {
    console.log("MYSQL ERROR:", e);
    res.status(500).json({
      error: e.message,
    });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    var id = req.params.id;
    const db = new skillTbl();
    const result = await db.GetByIdSkill(id);
    res.status(200).json({
      Message: "Single data is fetched successfully.",
      Data: result,
    });
  } catch (e) {
    console.log("MYSQL ERROR:", e);
    res.status(500).json({
      error: e.message,
    });
  }
});

// Add skills

router.post("/", async (req, res, next) => {
  try {
    const db = new skillTbl();
    await db.AddSkill(req.body);

    res.status(200).json({
        message: "Skills added Successfully"
    });
    
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: e.message,
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    var id = req.params.id;
    const db = new skillTbl();
    const result = await db.DeleteSkillById(id);
    res.status(200).json({
      Message: "Single data deleted successfully.",
      Data: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: e.message,
    });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    var id = req.params.id;
    const db = new skillTbl();
    const result = await db.UpdateSkill(id, req.body);
    res.status(200).json({
      Message: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: e.message,
    });
  }
});

module.exports = router;
