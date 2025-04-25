const ResultDAO = require("../dao/resultDAO");

class ResultService {
  constructor() {
    this.resultDAO = new ResultDAO();
  }
  saveResult = async (testId, studentId, result) => {
    const result = await this.resultDAO.saveResult(testId, studentId, result);
    return result;
  }

}

module.exports = ResultService;
