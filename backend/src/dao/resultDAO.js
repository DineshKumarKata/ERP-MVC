const ResultModel = require("../models/Result");

class ResultDAO {
  
  saveResult = async (testId, studentId, result) => {
    try {
      //   console.log("physics://localhost:3000/");
      const result = new ResultModel({ testId, studentId, result });
      const persistenceData = await result.save();
      console.log("ResultDAO - End of saveResult");
      return persistenceData;
    } catch (error) {
      console.error("ResultDAO - saveResult || Error:", error);
      throw error;
    }
  };


  
}

module.exports = ResultDAO;