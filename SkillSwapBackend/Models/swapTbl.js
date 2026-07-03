var MyConnection = require("../DBConnector/DBConnection");

class swapRequestTbl {
  async AddRequest(Model) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `INSERT INTO swaptbl
      (SenderId, ReceiverId, OfferedSkillId,
      RequestedSkillId, Message, Status, ScheduledDate)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Model.senderId,
        Model.receiverId,
        Model.offeredSkillId,
        Model.requestedSkillId,
        Model.message,
        Model.status || "Pending",
        Model.scheduledDate,
      ],
    );

    db.end();
    return result;
  }

  async GetList() {
    const db = await MyConnection();
    const [result] = await db.execute("SELECT * FROM swaptbl");
    db.end();
    return result;
  }

  async GetById(id) {
    const db = await MyConnection();
    const [result] = await db.execute(
      "SELECT * FROM swaptbl WHERE swapId=?",
      [id],
    );
    db.end();
    return result;
  }

  async UpdateStatus(id, status) {

  const db = await MyConnection();

  const [result] = await db.execute(
    `UPDATE swapTbl
     SET status=?
     WHERE swapId=?`,
    [status, id]
  );

  db.end();

  return result;
}

  async DeleteRequest(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "DELETE FROM swaptbl WHERE swapId=?",
      [id],
    );

    db.end();
    return result;
  }
}

module.exports = swapRequestTbl;
