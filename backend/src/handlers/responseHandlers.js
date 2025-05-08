const ResponseService = require("../services/responseService");

class ResponseHandler {
  constructor() {
    this.responseService = new ResponseService();
  }

  saveResponse = async (req, res) => {
    console.log("ResponseHandler - Inside of saveResponse");
    try {
      const { testId, questionBankId, questionId, selectedOption } = req.body;
      const studentEmail = req.email; // Assuming email is set in req by middleware

      // Validate required fields
      if (
        !studentEmail ||
        !testId ||
        !questionBankId ||
        !questionId ||
        !selectedOption
      ) {
        console.log("ResponseHandler - End of saveResponse - Bad Request");
        return res.status(400).send({
          status: "Failure",
          message: "Bad Request - All fields are required",
          code: "400",
        });
      }

      const result = await this.responseService.saveStudentResponse({
        studentEmail,
        testId,
        questionBankId,
        questionId,
        selectedOption,
      });

      const successMessage = result.updated
        ? "Response updated successfully"
        : "Response saved successfully";
      console.log(`ResponseHandler - End of saveResponse - ${successMessage}`);

      const statusCode = result.updated ? 200 : 201;
      return res.status(statusCode).send({
        status: "Success",
        message: successMessage,
        code: statusCode.toString(),
      });
    } catch (error) {
      console.error("ResponseHandler - End of saveResponse || Error:", error);

      // Handle specific error types
      if (error.message === "Invalid selected option") {
        return res.status(400).send({
          status: "Failure",
          message: "Invalid selected option",
          code: "400",
        });
      } else if (error.message === "Question not found") {
        return res.status(404).send({
          status: "Failure",
          message: "Question not found",
          code: "404",
        });
      }

      return res.status(500).send({
        status: "Failure",
        message:
          error.message || "Internal Server Issue. Please try after sometime.",
        code: "500",
      });
    }
  };

  getAllResponses = async (req, res) => {
    console.log("ResponseHandler - Inside of getAllResponses");
    try {
      const { testId } = req.query;
      const studentEmail = req.email; // Assuming email is set in req by middleware

      // Validate required query parameters
      if (!studentEmail || !testId) {
        console.log("ResponseHandler - End of getAllResponses - Bad Request");
        return res.status(400).send({
          status: "Failure",
          message: "Bad Request - studentEmail and testId are required",
          code: "400",
        });
      }

      const responses = await this.responseService.getStudentResponses(
        studentEmail,
        testId
      );

      console.log("ResponseHandler - End of getAllResponses - Success");
      return res.status(200).send({
        status: "Success",
        message: "Responses retrieved successfully",
        code: "200",
        data: responses,
      });
    } catch (error) {
      console.error(
        "ResponseHandler - End of getAllResponses || Error:",
        error
      );
      return res.status(500).send({
        status: "Failure",
        message:
          error.message || "Internal Server Issue. Please try after sometime.",
        code: "500",
      });
    }
  };

  getSpecificResponse = async (req, res) => {
    console.log("ResponseHandler - Inside of getSpecificResponse");
    try {
      const { testId } = req.query;
      const studentEmail = req.email; // Assuming email is set in req by middleware

      // Validate required query parameters
      if (!studentEmail || !testId) {
        console.log(
          "ResponseHandler - End of getSpecificResponse - Bad Request"
        );
        return res.status(400).send({
          status: "Failure",
          message: "Bad Request - studentEmail and testId are required",
          code: "400",
        });
      }

      const responses = await this.responseService.getSpecificResponses(
        studentEmail,
        testId
      );

      console.log("ResponseHandler - End of getSpecificResponse - Success");
      return res.status(200).send({
        status: "Success",
        message: "Specific responses retrieved successfully",
        code: "200",
        data: responses,
      });
    } catch (error) {
      console.error(
        "ResponseHandler - End of getSpecificResponse || Error:",
        error
      );

      if (error.message === "No responses found") {
        return res.status(404).send({
          status: "Failure",
          message: "No responses found",
          code: "404",
        });
      }

      return res.status(500).send({
        status: "Failure",
        message:
          error.message || "Internal Server Issue. Please try after sometime.",
        code: "500",
      });
    }
  };

  deleteResponse = async (req, res) => {
    console.log("ResponseHandler - Inside of deleteResponse");
    try {
      const { testId, questionId } = req.body;
      const studentEmail = req.email; // Assuming email is set in req by middleware

      // Validate required fields
      if (!studentEmail || !testId || !questionId) {
        console.log("ResponseHandler - End of deleteResponse - Bad Request");
        return res.status(400).send({
          status: "Failure",
          message:
            "Bad Request - studentEmail, testId, and questionId are required",
          code: "400",
        });
      }

      await this.responseService.deleteStudentResponse(
        studentEmail,
        testId,
        questionId
      );

      console.log("ResponseHandler - End of deleteResponse - Success");
      return res.status(200).send({
        status: "Success",
        message: "Response deleted successfully",
        code: "200",
      });
    } catch (error) {
      console.error("ResponseHandler - End of deleteResponse || Error:", error);

      if (error.message === "Response not found") {
        return res.status(404).send({
          status: "Failure",
          message: "Response not found",
          code: "404",
        });
      }

      return res.status(500).send({
        status: "Failure",
        message:
          error.message || "Internal Server Issue. Please try after sometime.",
        code: "500",
      });
    }
  };
}

module.exports = ResponseHandler;
