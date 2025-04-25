const QuestionBankModel = require("../models/QuestionBankModel.js");

class QuestionBankDao {
  create = async (questionBank) => {
    try {
      console.log("QuestionBankDao - Inside of create");
      const persistanceData = await questionBank.save();
      console.log("QuestionBankDao - End of create");
      return persistanceData;
    } catch (error) {
      console.error("QuestionBank - create ||  Error : ", error.message);
      throw error;
    }
  };

  findById = async (id) => {
    try {
      console.log("QuestionBankDao - Inside of findbyid");
      const persistanceData = await QuestionBankModel.findById(id);
      console.log("QuestionBankDao - End of findbyid");
      return persistanceData;
    } catch (error) {
      console.error("QuestionBank - findbyId ||  Error : ", error.message);
      throw error;
    }
  };

  getAll = async () => {
    try {
      console.log("QuestionBankDao - Inside of getAll");
      const persistanceData = await QuestionBankModel.find()
        .select("name questions createdBy createdAt totalQuestions description")
        .sort({ createdAt: -1 });
      console.log("QuestionBankDao - End of getAll");
      return persistanceData;
    } catch (error) {
      console.error("QuestionBank - getAll ||  Error : ", error.message);
      throw error;
    }
  }



  getById = async (id) => {
    try {
      console.log("QuestionBankDao - Inside of findbyid");
      const persistanceData = await QuestionBankModel.findById(id).populate(
        "questions"
      );
      console.log("QuestionBankDao - End of findbyid");
      return persistanceData;
    } catch (error) {
      console.error("QuestionBank - findbyId ||  Error : ", error.message);
      throw error;
    }
  };

  update = async (id, data) => {
    try {
      console.log("QuestionBankDao - Inside of update");
      const persistanceData = await QuestionBankModel.findByIdAndUpdate(
        id,
        data,
        { new: true }
      );
      console.log("QuestionBankDao - End of update");
      return persistanceData;
    } catch (error) {
      console.error("QuestionBank - update ||  Error : ", error.message);
      throw error;
    }
  };
}

module.exports = QuestionBankDao;
