var MyConnection = require("../DBConnector/DBConnection");
const bcrypt = require("bcrypt");

class userTbl {
  //  insert data
  async AddUser(Model) {
    const db = await MyConnection();
    const [result] = await db.execute(
      `INSERT INTO usertbl
      (Name, Email, Mobile, Password, Address, Skills, Bio, Intrest)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Model.Name,
        Model.Email,
        Model.Mobile,
        Model.Password,
        Model.Address,
        Model.Skills,
        Model.Bio,
        Model.Intrest,
      ],
    );
    db.end();
    if (result) {
      console.log(result);
      return "Your Data is successfully stored.";
    } else {
      return "Something is wrong in the DB";
    }
  }

  // login user

  async LoginUser(email, password) {
    const db = await MyConnection();

    const [rows] = await db.execute("SELECT * FROM usertbl WHERE email=?", [
      email,
    ]);

    db.end();

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];

    // Handle both PascalCase 'Password' (DB column) and lowercase 'password'
    const hashedPassword = user.Password || user.password;

    // Guard: if no hashed password stored, treat as invalid credentials
    if (!hashedPassword) {
      return null;
    }

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      return null;
    }

    return user;
  }

  //  get data
  async GetList() {
    const db = await MyConnection();
    const [result] = await db.execute("Select * from usertbl");
    db.end();
    if (result) {
      console.log(result);
      return result;
    } else {
      return "Something is wrong in the DB";
    }
  }

  //  get data by id
  async GetByIdUser(id) {
    const db = await MyConnection();
    const [result] = await db.execute("Select  * from usertbl Where userId=?", [
      id,
    ]);
    db.end();
    if (result) {
      console.log(result);
      return result;
    } else {
      return "Something is wrong in the DB";
    }
  }

  // delete data by id
  async DeleteUserById(id) {
    const db = await MyConnection();
    const [result] = await db.execute("Delete from usertbl Where userId=?", [
      id,
    ]);
    db.end();
    if (result) {
      console.log(result);
      return result;
    } else {
      return "Something is wrong in the DB";
    }
  }

  // update profile data
  async UpdateUser(id, Model) {
    const db = await MyConnection();
    const [result] = await db.execute(
      `UPDATE usertbl
       SET Name=?, Email=?, Mobile=?, Address=?, Bio=?
       WHERE userId=?`,
      [Model.Name, Model.Email, Model.Mobile, Model.Address, Model.Bio, id],
    );
    db.end();
    if (result) {
      return result;
    } else {
      return "Something is wrong in the DB";
    }
  }

  // check email exist or not
  async CheckEmail(email) {
    const db = await MyConnection();
    const [result] = await db.execute("Select * from usertbl where email=?", [
      email,
    ]);
    db.end();
    return result;
  }

  async UpdateBlockStatus(id, status) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "UPDATE userTbl SET isBlocked=? WHERE userId=?",
      [status, id],
    );

    db.end();
    return result;
  }
}

module.exports = userTbl;
