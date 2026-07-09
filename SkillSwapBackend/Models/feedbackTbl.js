var MyConnection = require("../DBConnector/DBConnection");

class feedbackTbl {
  async AddFeedback(Model) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `INSERT INTO reviewTbl
      (ReviewerId, ReviewedUserId, SwapId, Rating, Comment)
      VALUES (?, ?, ?, ?, ?)`,
      [
        Model.reviewerId,
        Model.reviewedUserId,
        Model.swapId,
        Model.rating,
        Model.comment,
      ],
    );

    db.end();
    return result;
  }

  async GetUserFeedbacks(userId) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `SELECT * FROM reviewTbl
      WHERE ReviewedUserId=?`,
      [userId],
    );

    db.end();
    return result;
  }

  async GetFeedbackByReviewer(userId) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `SELECT * FROM reviewTbl
      WHERE ReviewerId=?`,
      [userId],
    );

    db.end();
    return result;
  }

  async GetAllFeedback() {
    const db = await MyConnection();

    const [result] = await db.execute(`SELECT * FROM reviewTbl`);

    db.end();
    return result;
  }

  async DeleteFeedback(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "DELETE FROM reviewTbl WHERE reviewId=?",
      [id],
    );

    db.end();
    return result;
  }
}

module.exports = feedbackTbl;