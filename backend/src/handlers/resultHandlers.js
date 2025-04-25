const ResultService = require("../services/resultService");
const mongoose = require("mongoose"); // Add this import

class TestHandler {
  constructor() {
    this.resultService = new ResultService();
  }
  saveResult = async (req, res) => {
    const { testId, studentId, result } = req.body;
    const result = await this.resultService.saveResult(testId, studentId, result);
    res.status(200).json(result);
  } 

}
module.exports = ResultHandler;
