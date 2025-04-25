const AdmissionHandler = require("../handlers/admissionHandlers");

const handler = new AdmissionHandler();

const wrapperFunctions = {
  getAllAdmissions: (req, res) => handler.getAllAdmissions(req, res),
};

module.exports = wrapperFunctions;
