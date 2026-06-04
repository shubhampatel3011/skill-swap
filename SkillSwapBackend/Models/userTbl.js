var MyConnection = require("../DBConnector/DBConnection");

class userTbl {
  //  insert data
  async AddUser(Model) {
    const db = await MyConnection();
    const [result] = await db.execute(
      `INSERT INTO usertbl
      (Name, Email, Mobile, Password, Address, Skills, Intrest)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Model.Name,
        Model.Email,
        Model.Mobile,
        Model.Password,
        Model.Address,
        Model.Skills,
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

  async LoginUser(Email, Password) {
    const db = await MyConnection();
    const [result] = await db.execute(
      `SELECT * FROM usertbl
     WHERE email = ? AND password = ?`,

      [Email, Password],
    );

    db.end();

    return result;
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
    const [result] = await db.execute("Delete * from usertbl Where userId=?", [
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

  // update data
  async UpdateUser(id, Model) {
    const db = await MyConnection();
    const [result] = await db.execute(
      "Update usertbl set name=?, email=? Where userId=?",
      [Model.Name, Model.Email, id],
    );
    db.end();
    if (result) {
      console.log(result);
      return result;
    } else {
      return "Something is wrong in the DB";
    }
  }

  // check email exist or not
  async CheckEmail(email) {
    const db = await MyConnection();
    const [result] = await db.execute(
      "Select * from usertbl where email=?",
      [email],
    );
    db.end();
    return result;
  }
}

module.exports = userTbl;