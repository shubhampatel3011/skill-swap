var MyConnection = require("../DBConnector/DBConnection");

class messageTbl {
  async AddMessage(Model) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `INSERT INTO messageTbl
      (SwapId, SenderId, senderName, ReceiverId, receiverName, Message)
      VALUES (?, ?, ?, ? , ?, ?)`,
      [Model.swapId, Model.senderId, Model.senderName, Model.receiverId, Model.receiverName, Model.message],
    );

    db.end();
    return result;
  }

  async GetMessagesBySwap(swapId) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `SELECT * FROM messageTbl
      WHERE SwapId=?
      ORDER BY CreatedAt ASC`,
      [swapId],
    );

    db.end();
    return result;
  }

  async DeleteMessage(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "DELETE FROM messageTbl WHERE messageId=?",
      [id],
    );

    db.end();
    return result;
  }
}

module.exports = messageTbl;
