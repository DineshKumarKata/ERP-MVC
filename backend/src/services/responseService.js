const ResponseDAO = require("../dao/responseDAO");
const QuestionDAO = require("../dao/questionDAO");

class ResponseService {
  constructor() {
    this.responseDAO = new ResponseDAO();
    this.questionDAO = new QuestionDAO();
  }

  saveStudentResponse = async (responseData) => {
    console.log("ResponseService - Inside of saveStudentResponse");
    try {
      const {
        studentEmail,
        testId,
        questionBankId,
        questionId,
        selectedOption,
      } = responseData;

      // Validate the option
      if (!["A", "B", "C", "D"].includes(selectedOption)) {
        throw new Error("Invalid selected option");
      }

      // Fetch the question to get the correct answer
      const question = await this.questionDAO.findById(questionId);
      if (!question) {
        throw new Error("Question not found");
      }

      // Calculate ansMarks (correct answer * question marks or 0 if incorrect)
      const correctOption = question.answer;
      const ansMarks =
        selectedOption === correctOption
          ? 1 * question.qmarks
          : 0 * question.qmarks;

      // Check if a response already exists for this student, test, and question
      const existingResponse = await this.responseDAO.findOne({
        studentEmail,
        testId,
        questionId,
      });

      if (existingResponse) {
        // Update the existing response
        const updatedResponse = await this.responseDAO.updateResponse(
          { studentEmail, testId, questionId },
          { selectedOption, correctOption, ansMarks }
        );
        console.log("ResponseService - End of saveStudentResponse - Updated");
        return { updated: true, response: updatedResponse };
      }

      // Create a new response
      const newResponseData = {
        studentEmail,
        testId,
        questionBankId,
        questionId,
        selectedOption,
        correctOption,
        ansMarks,
      };

      const savedResponse = await this.responseDAO.saveResponse(
        newResponseData
      );
      console.log("ResponseService - End of saveStudentResponse - Created");
      return { updated: false, response: savedResponse };
    } catch (error) {
      console.error(
        "ResponseService - End of saveStudentResponse || Error:",
        error
      );
      throw error;
    }
  };

  getStudentResponses = async (studentEmail, testId) => {
    console.log("ResponseService - Inside of getStudentResponses");
    try {
      const responses = await this.responseDAO.findByStudentAndTest(
        studentEmail,
        testId
      );
      console.log("ResponseService - End of getStudentResponses - Success");
      return responses;
    } catch (error) {
      console.error(
        "ResponseService - End of getStudentResponses || Error:",
        error
      );
      throw error;
    }
  };

  getSpecificResponses = async (studentEmail, testId) => {
    console.log("ResponseService - Inside of getSpecificResponses");
    try {
      const responses = await this.responseDAO.findQuestionsAndResponses(
        studentEmail,
        testId
      );
      if (responses.length === 0) {
        throw new Error("No responses found");
      }
      console.log("ResponseService - End of getSpecificResponses - Success");
      return responses;
    } catch (error) {
      console.error(
        "ResponseService - End of getSpecificResponses || Error:",
        error
      );
      throw error;
    }
  };

  deleteStudentResponse = async (studentEmail, testId, questionId) => {
    console.log("ResponseService - Inside of deleteStudentResponse");
    try {
      const result = await this.responseDAO.deleteResponse({
        studentEmail,
        testId,
        questionId,
      });

      if (result.deletedCount === 0) {
        throw new Error("Response not found");
      }

      console.log("ResponseService - End of deleteStudentResponse - Success");
      return result;
    } catch (error) {
      console.error(
        "ResponseService - End of deleteStudentResponse || Error:",
        error
      );
      throw error;
    }
  };
}

module.exports = ResponseService;
