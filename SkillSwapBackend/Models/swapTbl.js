var MyConnection = require("../DBConnector/DBConnection");

class swapRequestTbl {
  async AddRequest(Model) {
    const db = await MyConnection();

    // Fetch Sender's Name if not provided
    let senderName = Model.senderName || "";
    if (!senderName && Model.senderId) {
      const [senders] = await db.execute("SELECT Name FROM usertbl WHERE userId=?", [Model.senderId]);
      if (senders.length > 0) {
        senderName = senders[0].Name || "";
      }
    }

    // Fetch Receiver's Name if not provided
    let receiverName = Model.receiverName || "";
    if (!receiverName && Model.receiverId) {
      const [receivers] = await db.execute("SELECT Name FROM usertbl WHERE userId=?", [Model.receiverId]);
      if (receivers.length > 0) {
        receiverName = receivers[0].Name || "";
      }
    }

    const [result] = await db.execute(
      `INSERT INTO swaptbl
      (senderId, senderName, receiverId, receiverName, offeredSkillId, offeredSkill,
      requestedSkillId, requestedSkill, message, status, scheduledDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Model.senderId,
        senderName,
        Model.receiverId,
        receiverName,
        Model.offeredSkillId,
        Model.offeredSkill,
        Model.requestedSkillId,
        Model.requestedSkill,
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
      [status, id],
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
