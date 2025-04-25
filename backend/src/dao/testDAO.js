const TestModel = require("../models/Test");

class TestDAO {
  create = async (testData) => {
    try {
      //   console.log("physics://localhost:3000/");
      const test = new TestModel({ ...testData });
      const persistenceData = await test.save();
      console.log("TestDAO - End of create");
      return persistenceData;
    } catch (error) {
      console.error("TestDAO - create || Error:", error);
      throw error;
    }
  };

  getAll = async () => {
    try {
      console.log("TestDAO - Inside of getAll");
      const tests = await TestModel.find()
        .select("name subjects createdBy createdAt totalQuestions description")
        .sort({ createdAt: -1 });
      console.log("TestDAO - End of getAll");
      return tests;
    } catch (error) {
      console.error("TestDAO - getAll || Error:", error);
      throw error;
    }
  };

  getById = async (id) => {
    try {
      console.log("TestDAO - Inside of getById");
      const test = await TestModel.findById(id)
        .populate({
          path: "subjects",
          populate: {
            path: "questions.easy questions.average questions.difficult",
            model: "Question",
          },
        })
        .populate("questionBankId", "name");
      console.log("TestDAO - End of getById");
      return test;
    } catch (error) {
      console.error("TestDAO - getById || Error:", error);
      throw error;
    }
  };
  
}

module.exports = TestDAO;