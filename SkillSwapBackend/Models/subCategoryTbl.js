var MyConnection = require("../DBConnector/DBConnection");

class subCategoryTbl {
  async AddSubCategory(Model) {
    const db = await MyConnection();
    const [result] = await db.execute(
      `INSERT INTO subCategoryTbl
      (categoryId, subCategoryName, description, status)
      VALUES (?, ?, ?, ?)`,
      [Model.CategoryId, Model.SubCategoryName, Model.Description, Model.Status],
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

    const [result] = await db.execute("SELECT * FROM subCategoryTbl");

    db.end();
    return result;
  }

  async GetById(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "SELECT * FROM subCategoryTbl WHERE subCategoryId=?",
      [id],
    );

    db.end();
    return result;
  }

  async DeleteSubCategory(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "DELETE FROM subCategoryTbl WHERE subCategoryId=?",
      [id],
    );

    db.end();
    return result;
  }

  async UpdateSubCategory(id, Model) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `UPDATE subCategoryTbl
       SET categoryId=?, subCategoryName=?, description=?, status=?
       WHERE subCategoryId=?`,
      [Model.CategoryId, Model.SubCategoryName, Model.Description, Model.Status, id],
    );

    db.end();
    return result;
  }
}

module.exports = subCategoryTbl;