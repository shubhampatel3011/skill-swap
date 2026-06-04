var express = require("express");
var router = express.Router();
const swapTbl = require("../Models/swapTbl");

// get swap list
router.get("/", async(req, res, next) =>{
    try {
      const db = new swapTbl();
      const result = await db.GetList();
      res.status(200).json({
        Message: "swapTbl data is fetched successfully.",
        List: result,
      });
    }
    catch (e) {
      console.log("MYSQL ERROR:", e);
      res.status(500).json({
        error: e.message,
      });
    }
})