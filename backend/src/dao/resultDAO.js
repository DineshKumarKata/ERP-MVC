const ResultModel = require("../models/Result");
const ResponseModel = require("../models/Response");
const SlotBookingModel = require("../models/SlotBooking");
const TestModel = require("../models/Test");

class ResultDAO {
  create = async (resultData) => {
    try {
      console.log("ResultDAO - Inside of create");
      const result = new ResultModel({ ...resultData });
      const persistenceData = await result.save();
      console.log("ResultDAO - End of create");
      return persistenceData;
    } catch (error) {
      console.error("ResultDAO - create || Error:", error);
      throw error;
    }
  };

  findOne = async (query) => {
    try {
      console.log("ResultDAO - Inside of findOne");
      const result = await ResultModel.findOne(query);
      console.log("ResultDAO - End of findOne");
      return result;
    } catch (error) {
      console.error("ResultDAO - findOne || Error:", error);
      throw error;
    }
  };

  getTestById = async (testId) => {
    try {
      console.log("ResultDAO - Inside of getTestById");
      const test = await TestModel.findById(testId).lean();
      console.log("ResultDAO - End of getTestById");
      return test;
    } catch (error) {
      console.error("ResultDAO - getTestById || Error:", error);
      throw error;
    }
  };

  getStudentAnswers = async (query) => {
    try {
      console.log("ResultDAO - Inside of getStudentAnswers");
      const answers = await ResponseModel.find(query).populate('questionId');
      console.log("ResultDAO - End of getStudentAnswers");
      return answers;
    } catch (error) {
      console.error("ResultDAO - getStudentAnswers || Error:", error);
      throw error;
    }
  };

  updateSlotBooking = async (query, update) => {
    try {
      console.log("ResultDAO - Inside of updateSlotBooking");
      const updatedSlot = await SlotBookingModel.findOneAndUpdate(
        query,
        update,
        { new: true }
      );
      console.log("ResultDAO - End of updateSlotBooking");
      return updatedSlot;
    } catch (error) {
      console.error("ResultDAO - updateSlotBooking || Error:", error);
      throw error;
    }
  };
}

module.exports = ResultDAO;