const AdmissionHandler = require("../handlers/admissionHandlers");

const handler = new AdmissionHandler();

const wrapperFunctions = {
  getAllAdmissions: (req, res) => handler.getAllAdmissions(req, res),
  getSeatsData: (req, res) => handler.getSeatsData(req, res),
  checkStudentIRADMDetails: (req, res) => handler.checkStudentIRADMDetails(req, res),
  getFeeCategoryId: (req, res) => handler.getFeeCategoryId(req, res),
  getFeeId: (req, res) => handler.getFeeId(req, res),
  getFeeDetails: (req, res) => handler.getFeeDetails(req, res),
  getConcessionTypes: (req, res) => handler.getConcessionTypes(req, res),
  postAdmissionDetails: (req, res) => handler.postAdmissionDetails(req, res),
};

module.exports = wrapperFunctions;


