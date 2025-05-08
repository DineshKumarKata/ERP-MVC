const ResultService = require("../services/resultService");

class ResultHandler {
  constructor() {
    this.resultService = new ResultService();
  }

  saveResult = async (req, res) => {
    const { testId, slotId } = req.body;
    const studentEmail = req.email;

    try {
      // Validate required fields
      if (!studentEmail || !testId) {
        return res.status(400).json({ 
          message: "All fields are required.",
          details: {
            studentEmail: !studentEmail ? "Missing" : "Provided",
            testId: !testId ? "Missing" : "Provided"
          }
        });
      }

      const response = await this.resultService.saveResult({
        studentEmail,
        testId,
        slotId
      });

      res.status(201).json({ 
        message: "Result saved successfully!",
        ...response
      });
    } catch (error) {
      console.error("Error saving result:", error);
      
      if (error.message === "Test already submitted - only one submission allowed per test") {
        return res.status(409).json({
          message: error.message
        });
      }
      
      res.status(500).json({ 
        message: "Failed to save result",
        error: {
          message: error.message,
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        }
      });
    }
  }

  checkSubmission = async (req, res) => {
    const studentEmail = req.email;
    try {
      const response = await this.resultService.checkSubmission(studentEmail);
      res.json(response);
    } catch (error) {
      console.error("Error checking exam submission:", error);
      res.status(500).json({
        message: "Failed to check exam submission",
        error: error.message,
      });
    }
  }

  getResults = async (req, res) => {
    const { testId } = req.params;
    const studentEmail = req.email;
    try {
      if (!studentEmail || !testId) {
        return res.status(400).json({ message: "studentEmail and testId are required." });
      }

      const results = await this.resultService.getResults({ studentEmail, testId });
      res.status(200).json(results);
    } catch (error) {
      console.error("Error retrieving results:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = new ResultHandler();
