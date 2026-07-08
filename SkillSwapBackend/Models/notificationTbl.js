var MyConnection = require("../DBConnector/DBConnection");

class notificationTbl {
  async AddNotification(Model) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `INSERT INTO notificationTbl
      (userId, title, message, isRead)
      VALUES (?, ?, ?, ?)`,
      [Model.userId, Model.title, Model.message, 0],
    );

    db.end();
    return result;
  }

  async GetNotifications(userId) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `SELECT * FROM notificationTbl
      WHERE UserId=?
      ORDER BY CreatedAt DESC`,
      [userId],
    );

    db.end();
    return result;
  }

  async MarkAsRead(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `UPDATE notificationTbl
      SET IsRead=1
      WHERE notificationId=?`,
      [id],
    );

    db.end();
    return result;
  }

  async DeleteNotification(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "DELETE FROM notificationTbl WHERE notificationId=?",
      [id],
    );

    db.end();
    return result;
  }
}

module.exports = notificationTbl;
