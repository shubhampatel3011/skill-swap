var MyConnection = require("../DBConnector/DBConnection");

class subCategoryTbl {

  async AddSubCategory(Model) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `INSERT INTO subCategoryTbl
      (categoryId, subCategoryName)
      VALUES (?, ?)`,
      [
        Model.categoryId,
        Model.subCategoryName
      ]
    );

    db.end();
    return result;
  }

  async GetList() {
    const db = await MyConnection();

    const [result] = await db.execute(
      "SELECT * FROM subCategoryTbl"
    );

    db.end();
    return result;
  }

  async GetById(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "SELECT * FROM subCategoryTbl WHERE subCategoryId=?",
      [id]
    );

    db.end();
    return result;
  }

  async DeleteSubCategory(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "DELETE FROM subCategoryTbl WHERE subCategoryId=?",
      [id]
    );

    db.end();
    return result;
  }

  async UpdateSubCategory(id, Model) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `UPDATE subCategoryTbl
       SET categoryId=?, subCategoryName=?
       WHERE subCategoryId=?`,
      [
        Model.categoryId,
        Model.subCategoryName,
        id
      ]
    );

    db.end();
    return result;
  }
}

module.exports = subCategoryTbl;