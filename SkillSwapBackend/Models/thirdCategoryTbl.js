var MyConnection = require("../DBConnector/DBConnection");

class thirdCategoryTbl {

  async AddThirdCategory(Model) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `INSERT INTO thirdCategoryTbl
      (categoryId, subCategoryId, thirdCategoryName)
      VALUES (?, ?, ?)`,
      [
        Model.categoryId,
        Model.subCategoryId,
        Model.thirdCategoryName
      ]
    );

    db.end();
    return result;
  }

  async GetList() {
    const db = await MyConnection();

    const [result] = await db.execute(
      "SELECT * FROM thirdCategoryTbl"
    );

    db.end();
    return result;
  }

  async GetById(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "SELECT * FROM thirdCategoryTbl WHERE thirdCategoryId=?",
      [id]
    );

    db.end();
    return result;
  }

  async DeleteThirdCategory(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "DELETE FROM thirdCategoryTbl WHERE thirdCategoryId=?",
      [id]
    );

    db.end();
    return result;
  }

  async UpdateThirdCategory(id, Model) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `UPDATE thirdCategoryTbl
       SET categoryId=?,
           subCategoryId=?,
           thirdCategoryName=?
       WHERE thirdCategoryId=?`,
      [
        Model.categoryId,
        Model.subCategoryId,
        Model.thirdCategoryName,
        id
      ]
    );

    db.end();
    return result;
  }
}

module.exports = thirdCategoryTbl;