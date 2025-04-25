const StudentHandler = require('../handlers/studentHandlers');

// Create a singleton instance of the handler
const handler = new StudentHandler();

// Create wrapper functions for each method
const wrapperFunctions = {
  studentRegistration: (req, res) => handler.studentRegistration(req, res),
  loginUser: (req, res) => handler.loginUser(req, res),
  refreshToken: (req, res) => handler.refreshToken(req, res),
  setStudentPassword: (req, res) => handler.setStudentPassword(req, res),
  internationalStudentRegistration: (req, res) => handler.internationalStudentRegistration(req, res),
  getInternationalStudentDetails: (req, res) => handler.getInternationalStudentDetails(req, res),
  getCertificates: (req, res) => handler.getCertificates(req, res),
  uploadCertificate: (req, res) => handler.uploadCertificate(req, res),
  getCertificate: (req, res) => handler.getCertificate(req, res),
  updateCertificate: (req, res) => handler.updateCertificate(req, res),
  deleteCertificate: (req, res) => handler.deleteCertificate(req, res),
  getUserDetails: (req, res) => handler.getUserDetails(req, res)
};

module.exports = wrapperFunctions; 