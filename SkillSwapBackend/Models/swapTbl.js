var MyConnection = require("../DBConnector/DBConnection");

class skillTbl {
  // insert data
  async AddSkill(Model) {
    const db = await MyConnection();
    const [result] = await db.execute(
      `INSERT INTO skillTbl
            (SkillToLearn, Category, Description, Mode)
            VALUES (?, ?, ?, ?, ?, ?)`,
      [
        Model.Title,
        Model.Category,
        Model.Description,
        Model.ExperienceLevel,
        Model.Availibility,
        Model.Mode,
      ],
    );
    db.end();
    if (result) {
      console.log(result);
      return "Your Data is successfully stored.";
    }
    else {
      return "Somethin is wrong in the DB";
    }
  }
}
