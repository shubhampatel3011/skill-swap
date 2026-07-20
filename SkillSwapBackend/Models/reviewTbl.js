var MyConnection = require("../DBConnector/DBConnection");

class reviewTbl {
  async AddReview(Model) {
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

  async GetUserReviews(userId) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `SELECT * FROM reviewTbl
      WHERE ReviewedUserId=?`,
      [userId],
    );

    db.end();
    return result;
  }

  async GetReviewsByReviewer(userId) {
    const db = await MyConnection();

    const [result] = await db.execute(
      `SELECT * FROM reviewTbl
      WHERE ReviewerId=?`,
      [userId],
    );

    db.end();
    return result;
  }

  async GetAllReviews() {
    const db = await MyConnection();

    const [result] = await db.execute(`
      SELECT r.*, 
             u1.Name AS ReviewerName, 
             u2.Name AS ReviewedUserName,
             s.OfferedSkill,
             s.RequestedSkill
      FROM reviewTbl r
      LEFT JOIN usertbl u1 ON r.ReviewerId = u1.userId
      LEFT JOIN usertbl u2 ON r.ReviewedUserId = u2.userId
      LEFT JOIN swaptbl s ON r.SwapId = s.swapId
    `);

    db.end();
    return result;
  }

  async DeleteReview(id) {
    const db = await MyConnection();

    const [result] = await db.execute(
      "DELETE FROM reviewTbl WHERE reviewId=?",
      [id],
    );

    db.end();
    return result;
  }
}

module.exports = reviewTbl;
