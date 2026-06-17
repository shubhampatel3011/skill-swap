var MyConnection = require("../DBConnector/DBConnection");

class thirdCategoryTbl {

  async AddThirdCategory(Model) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `INSERT INTO thirdCategoryTbl
      (categoryId, subCategoryId, thirdCategoryName, description, status)
      VALUES (?, ?, ?, ?, ?)`,
      [
        Model.categoryId,
        Model.subCategoryId,
        Model.thirdCategoryName,
        Model.description || "",
        Model.status || "Active"
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
           thirdCategoryName=?,
           description=?,
           status=?
       WHERE thirdCategoryId=?`,
      [
        Model.categoryId,
        Model.subCategoryId,
        Model.thirdCategoryName,
        Model.description || "",
        Model.status || "Active",
        id
      ]
    );

    db.end();
    return result;
  }
}

module.exports = thirdCategoryTbl;