var MyConnection = require("../DBConnector/DBConnection");

class categoryTbl {

  async AddCategory(Model) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `INSERT INTO categoryTbl (categoryName)
       VALUES (?)`,
      [Model.categoryName]
    );

    db.end();
    return result;
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
      "UPDATE categoryTbl SET categoryName=? WHERE categoryId=?",
      [Model.categoryName, id]
    );

    db.end();
    return result;
  }
}

module.exports = categoryTbl;