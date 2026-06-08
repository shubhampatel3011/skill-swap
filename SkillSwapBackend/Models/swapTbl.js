var MyConnection = require("../DBConnector/DBConnection");

class swapRequestTbl {
  async AddRequest(Model) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `INSERT INTO swapRequestTbl
      (SenderId, ReceiverId, OfferedSkillId,
      RequestedSkillId, Message, Status, ScheduledDate)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Model.senderId,
        Model.receiverId,
        Model.offeredSkillId,
        Model.requestedSkillId,
        Model.message,
        Model.status || "pending",
        Model.scheduledDate,
      ],
    );

    db.end();
    return result;
  }

  async GetList() {
    const db = await MyConnection();
    const [result] = await db.execute("SELECT * FROM swapRequestTbl");
    db.end();
    return result;
  }

  async GetById(id) {
    const db = await MyConnection();
    const [result] = await db.execute(
      "SELECT * FROM swapRequestTbl WHERE swapId=?",
      [id],
    );
    db.end();
    return result;
  }

  async UpdateStatus(id, status) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `UPDATE swapRequestTbl
      SET Status=?
      WHERE swapId=?`,
      [status, id],
    );

    db.end();
    return result;
  }

  async DeleteRequest(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "DELETE FROM swapRequestTbl WHERE swapId=?",
      [id],
    );

    db.end();
    return result;
  }
}

module.exports = swapRequestTbl;
