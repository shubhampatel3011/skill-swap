var MyConnection = require("../DBConnector/DBConnection");

class skillTbl {
  // insert data
  async AddSkill(Model) {
    const db = await MyConnection();
    console.log("Skill Model:", Model);
console.log([
  Model.userId,
  Model.title,
  Model.category,
  Model.description,
  Model.experienceLevel,
  Model.availability,
  Model.mode,
]);
    

    const [result] = await db.execute(
      `INSERT INTO skillTbl
            (userId, Name, Title, Category, Description, ExperienceLevel, Availability, Mode)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Model.userId,
        Model.name,
        Model.title,
        Model.category,
        Model.description,
        Model.experienceLevel,
        Model.availability,
        Model.mode,
      ],
    );

    db.end();
    if (result) {
      console.log(result);
      return "Your Data is successfully stored.";
    } else {
      return "Something is wrong in the DB";
    }
  }

  //  get data
  async GetList() {
    const db = await MyConnection();
    const [result] = await db.execute("Select * from skilltbl");
    db.end();
    if (result) {
      console.log(result);
      return result;
    } else {
      return "Something is wrong in the DB";
    }
  }

  //  get data by id
  async GetByIdSkill(id) {
    const db = await MyConnection();
    const [result] = await db.execute(
      "Select  * from skilltbl Where skillId=?",
      [id],
    );
    db.end();
    if (result) {
      return result;
    } else {
      return "Something is wrong in the DB";
    }
  }

  // get skills by userId
  async GetByUserId(userId) {
    const db = await MyConnection();
    const [result] = await db.execute(
      "SELECT * FROM skilltbl WHERE userId=?",
      [userId],
    );
    db.end();
    return result;
  }

  // delete data by id
  async DeleteSkillById(id) {
    const db = await MyConnection();
    const [result] = await db.execute(
      "Delete FROM skilltbl WHERE skillId=?",
      [id],
    );
    db.end();
    if (result) {
      console.log(result);
      return result;
    } else {
      return "Something is wrong in the DB";
    }
  }

  // update data
  async UpdateUser(id, Model) {
    const db = await MyConnection();
    // db.connect();
    const [result] = await db.execute(
      "Update userTbl set name=?, email=? Where =?",
      [Model.Name, Model.Email, id],
    );
    db.end();
    if (result) {
      console.log(result);
      return result;
    } else {
      return "Something is wrong in the DB";
    }
  }

}

module.exports = skillTbl;