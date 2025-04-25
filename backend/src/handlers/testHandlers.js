const TestService = require("../services/testService");
const mongoose = require("mongoose"); // Add this import

class TestHandler {
  constructor() {
    this.testService = new TestService();
  }

  generateMultiSubjectTest = async (req, res) => {
    console.log("TestHandler - Inside of generateMultiSubjectTest");
    try {
      const { bankId, testName, subjectsData, createdBy, description } =
        req.body;

      if (!bankId || !testName || !subjectsData) {
        console.log(
          "TestHandler - End of generateMultiSubjectTest - Bad Request"
        );
        return res.status(400).send({
          status: "Failure",
          message:
            "Bad Request - Missing required fields: bankId, testName, subjectsData",
          code: "400",
        });
      }

      const response = await this.testService.generateMultiSubjectTest({
        bankId,
        testName,
        subjectsData,
        createdBy: createdBy || req.decoded?.email || "admin",
        description,
      });

      console.log("TestHandler - End of generateMultiSubjectTest - Success");
      return res.status(201).send({
        status: "Success",
        message: "Test generated successfully",
        code: "200",
        data: response,
      });
    } catch (error) {
      console.error(
        "TestHandler - End of generateMultiSubjectTest || Error:",
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

  getAllTests = async (req, res) => {
    console.log("TestHandler - Inside of getAllTests");
    try {
      const tests = await this.testService.getAllTests();
      console.log("TestHandler - End of getAllTests - Success");
      return res.status(200).send({
        status: "Success",
        message: "Tests retrieved successfully",
        code: "200",
        data: tests,
      });
    } catch (error) {
      console.error("TestHandler - End of getAllTests || Error:", error);
      return res.status(500).send({
        status: "Failure",
        message:
          error.message || "Internal Server Issue. Please try after sometime.",
        code: "500",
      });
    }
  };

getTestById = async (req, res) => {
    console.log("TestHandler - Inside of getTestById");
    try {
      const { id } = req.params;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        console.log("TestHandler - End of getTestById - Invalid ID");
        return res.status(400).send({
          status: "Failure",
          message: "Bad Request - Invalid or missing test ID",
          code: "400",
        });
      }

      const test = await this.testService.getTestById(id);
      if (!test) {
        console.log("TestHandler - End of getTestById - Test not found");
        return res.status(404).send({
          status: "Failure",
          message: "Test not found",
          code: "404",
        });
      }

      console.log("TestHandler - End of getTestById - Success");
      return res.status(200).send({
        status: "Success",
        message: "Test retrieved successfully",
        code: "200",
        data: test,
      });
    } catch (error) {
      console.error("TestHandler - End of getTestById || Error:", error);
      return res.status(500).send({
        status: "Failure",
        message: error.message || "Internal Server Issue. Please try after sometime.",
        code: "500",
      });
    }
  };

}
module.exports = TestHandler;
