const TestHandler = require("../handlers/testHandlers");

const handler = new TestHandler();

const wrapperFunctions = {
  generateMultiSubjectTest: (req, res) =>
    handler.generateMultiSubjectTest(req, res),
  getAllTests: (req, res) => handler.getAllTests(req, res),
  getTestById: (req, res) => handler.getTestById(req, res), // New wrapper
};

module.exports = wrapperFunctions;
