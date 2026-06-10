var MyConnection = require("../DBConnector/DBConnection");

class categoryTbl {

  async AddCategory(Model) {
    const db = await MyConnection();
    const [result] = await db.execute(
      `INSERT INTO categoryTbl
      (categoryName, description, status)
      VALUES (?, ?, ?)`,
      [
        Model.CategoryName,
        Model.Description,
        Model.Status,
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

  async GetList() {
    const db = await MyConnection();

    const [result] = await db.execute(
      "SELECT * FROM categoryTbl"
    );

    db.end();
    return result;
  }

  async GetById(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "SELECT * FROM categoryTbl WHERE categoryId=?",
      [id]
    );

    db.end();
    return result;
  }

  async DeleteCategory(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "DELETE FROM categoryTbl WHERE categoryId=?",
      [id]
    );

    db.end();
    return result;
  }

  async UpdateCategory(id, Model) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "UPDATE categoryTbl SET categoryName=?, description=?, status=? WHERE categoryId=?",
      [
        Model.CategoryName,
        Model.Description,
        Model.Status,
        id
      ]
    );

    db.end();
    return result;
  }
}

module.exports = categoryTbl;