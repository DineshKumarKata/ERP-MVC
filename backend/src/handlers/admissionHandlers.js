const AdmissionService = require("../services/admissionService");
const mongoose = require("mongoose"); // Add this import

class AdmissionHandler {
  constructor() {
    this.admissionService = new AdmissionService();
  }


  getAllAdmissions = async (req, res) => {
    console.log("AdmissionHandler - Inside of getAllAdmissions");
    try {
      const students = await this.admissionService.getAllAdmissions();
      console.log("AdmissionHandler - End of getAllAdmissions - Success");
      return res.status(200).send({
        status: "Success",
        message: "Admissions retrieved successfully",
        code: "200",
        data: students,
      });
    } catch (error) {
      console.error("AdmissionHandler - End of getAllAdmissions || Error:", error);
      return res.status(500).send({
        status: "Failure",
        message:
          error.message || "Internal Server Issue. Please try after sometime.",
        code: "500",
      });
    }
  };


}
module.exports = AdmissionHandler;
