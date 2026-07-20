var MyConnection = require("../DBConnector/DBConnection");

class feedbackTbl {
  constructor() {
    this.initTable();
  }

  async initTable() {
    try {
      const db = await MyConnection();
      await db.execute(`
        CREATE TABLE IF NOT EXISTS feedbacktbl (
          feedbackId INT AUTO_INCREMENT PRIMARY KEY,
          userName VARCHAR(255),
          userEmail VARCHAR(255),
          rating INT,
          category VARCHAR(255),
          comment TEXT,
          status VARCHAR(50) DEFAULT 'New',
          adminNotes TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      db.end();
    } catch (e) {
      console.error("Error creating feedbacktbl:", e);
    }
  }

  async AddFeedback(Model) {
    const db = await MyConnection();
    const [result] = await db.execute(
      `INSERT INTO feedbacktbl
      (userName, userEmail, rating, category, comment, status, adminNotes)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Model.userName || "Anonymous",
        Model.userEmail || "",
        Model.rating || 0,
        Model.category || "Other",
        Model.comment || "",
        Model.status || "New",
        Model.adminNotes || "",
      ]
    );
    db.end();
    return result;
  }

  async GetList() {
    const db = await MyConnection();
    const [result] = await db.execute("SELECT * FROM feedbacktbl ORDER BY createdAt DESC");
    db.end();
    return result;
  }

  async UpdateStatus(id, status) {
    const db = await MyConnection();
    const [result] = await db.execute(
      `UPDATE feedbacktbl
       SET status=?
       WHERE feedbackId=?`,
      [status, id]
    );
    db.end();
    return result;
  }

  async UpdateNotes(id, notes) {
    const db = await MyConnection();
    const [result] = await db.execute(
      `UPDATE feedbacktbl
       SET adminNotes=?
       WHERE feedbackId=?`,
      [notes, id]
    );
    db.end();
    return result;
  }

  async DeleteFeedback(id) {
    const db = await MyConnection();
    const [result] = await db.execute(
      "DELETE FROM feedbacktbl WHERE feedbackId=?",
      [id]
    );
    db.end();
    return result;
  }
}

module.exports = feedbackTbl;
