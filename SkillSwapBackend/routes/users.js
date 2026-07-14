var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/jwt");
const userTbl = require("../Models/userTbl");
const verifyToken = require("../middleware/authMiddleware");

/* GET users listing. */
router.get("/", verifyToken, async (req, res, next) => {
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

router.get("/:id", verifyToken, async (req, res, next) => {
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

router.post("/", verifyToken, async (req, res, next) => {
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

    const user = await UserModel.Login(Email, Password);

    if (!user) {
      return res.status(401).json({
        Message: "Invalid Email Or Password",
      });
    }

    const token = generateToken(user);

    res.json({
      Success: true,
      User: user,
      Token: token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      Message: "Server Error",
    });
  }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
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

router.put("/:id", verifyToken, async (req, res, next) => {
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

router.put("/block/:id", verifyToken, async (req, res) => {
  try {
    const db = new userTbl();

    await db.UpdateBlockStatus(req.params.id, req.body.isBlocked);

    res.status(200).json({
      message: "User status updated successfully",
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
    });
  }
});

module.exports = router;
