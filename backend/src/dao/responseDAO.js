const Response = require("../models/Response");

class ResponseDAO {
  saveResponse = async (responseData) => {
    try {
      console.log("ResponseDAO - Inside of saveResponse");
      const newResponse = new Response(responseData);
      const savedResponse = await newResponse.save();
      console.log("ResponseDAO - End of saveResponse");
      return savedResponse;
    } catch (error) {
      console.error("ResponseDAO - saveResponse || Error:", error);
      throw error;
    }
  };

  updateResponse = async (filter, update) => {
    try {
      console.log("ResponseDAO - Inside of updateResponse");
      const updatedResponse = await Response.findOneAndUpdate(filter, update, {
        new: true,
      });
      console.log("ResponseDAO - End of updateResponse");
      return updatedResponse;
    } catch (error) {
      console.error("ResponseDAO - updateResponse || Error:", error);
      throw error;
    }
  };

  findOne = async (filter) => {
    try {
      console.log("ResponseDAO - Inside of findOne");
      const response = await Response.findOne(filter);
      console.log("ResponseDAO - End of findOne");
      return response;
    } catch (error) {
      console.error("ResponseDAO - findOne || Error:", error);
      throw error;
    }
  };

  findByStudentAndTest = async (studentEmail, testId) => {
    try {
      console.log("ResponseDAO - Inside of findByStudentAndTest");
      const responses = await Response.find({
        studentEmail,
        testId,
      });
      console.log("ResponseDAO - End of findByStudentAndTest");
      return responses;
    } catch (error) {
      console.error("ResponseDAO - findByStudentAndTest || Error:", error);
      throw error;
    }
  };

  findQuestionsAndResponses = async (studentEmail, testId) => {
    try {
      console.log("ResponseDAO - Inside of findQuestionsAndResponses");
      const responses = await Response.find({
        studentEmail,
        testId,
      }).select("questionId selectedOption");
      console.log("ResponseDAO - End of findQuestionsAndResponses");
      return responses;
    } catch (error) {
      console.error("ResponseDAO - findQuestionsAndResponses || Error:", error);
      throw error;
    }
  };

  deleteResponse = async (filter) => {
    try {
      console.log("ResponseDAO - Inside of deleteResponse");
      const result = await Response.deleteOne(filter);
      console.log("ResponseDAO - End of deleteResponse");
      return result;
    } catch (error) {
      console.error("ResponseDAO - deleteResponse || Error:", error);
      throw error;
    }
  };
}

module.exports = ResponseDAO;
