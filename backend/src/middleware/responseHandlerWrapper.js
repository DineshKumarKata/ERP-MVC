const ResponseHandler = require("../handlers/responseHandlers");

const handler = new ResponseHandler();

const wrapperFunctions = {
  saveResponse: (req, res) => handler.saveResponse(req, res),
  getAllResponses: (req, res) => handler.getAllResponses(req, res),
  getSpecificResponse: (req, res) => handler.getSpecificResponse(req, res),
  deleteResponse: (req, res) => handler.deleteResponse(req, res),
};

module.exports = wrapperFunctions;
