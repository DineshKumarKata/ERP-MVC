const ResultHandler = require("../handlers/resultHandlers");

const handler = new ResultHandler();

const wrapperFunctions = {
  saveResult: (req, res) =>
    handler.saveResult(req, res),
};

module.exports = wrapperFunctions;
