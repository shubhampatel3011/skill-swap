var express = require("express");
var router = express.Router();
const userTbl = require("../Models/userTbl");

/* GET users listing. */
router.get("/", async (req, res, next) => {
  try {
    const db = new userTbl();
    const result = await db.GetList();
    res.status(200).json({
      Message: "userTbl data is fetched successfully.",
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
    const db = new userTbl();
    const result = await db.GetByIdUser(id);
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

router.post("/", async (req, res, next) => {
  try {
    const db = new userTbl();

    // check existing email
    const emailCheck = await db.CheckEmail(req.body.Email);
    if (emailCheck.length > 0) {
      return res.status(400).json({
        error: "Email already exists, please use a different email.",
      });
    }

// insert new user
    const result = await db.AddUser(req.body);
    res.status(200).json({
      Message: result,
    });
  } catch (e) {
      console.log("MYSQL ERROR:", e);
    res.status(500).json({
      error: e.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const db = new userTbl();

    const result = await db.LoginUser(Email, Password);

    if (result.length > 0) {
      res.status(200).json({
        Message: "Login successful",
        User: result[0],
      });
    } else {
      res.status(401).json({
        error: "Invalid email or password",
      });
    }
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
    const db = new userTbl();
    const result = await db.DeleteUserById(id);
    res.status(200).json({
      Message: "Single data deleted successfully.",
      Data: result,
    });
  } catch (e) {
      console.log("MYSQL ERROR:", e);
    res.status(500).json({
      error: e.message,
    });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    var id = req.params.id;
    const db = new userTbl();
    const result = await db.UpdateUser(id, req.body);
    res.status(200).json({
      Message: result,
    });
  } catch (e) {
      console.log("MYSQL ERROR:", e);
    res.status(500).json({
      error: e.message,
    });
  }
});

module.exports = router;
