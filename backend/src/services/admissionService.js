const AdmissionDAO = require("../dao/admissionDAO");

class AdmissionService {
  constructor() {
    this.admissionDAO = new AdmissionDAO();
  }


  getAllAdmissions = async () => {
    console.log("AdmissionService - Inside of getAllAdmissions");
    try {
      const students = await this.admissionDAO.getAll();
      console.log("AdmissionService - End of getAllAdmissions - Success");
      return students;
    } catch (error) {
      console.error("AdmissionService - End of getAllAdmissions || Error:", error);
      throw error;
    }
  };
  
}

module.exports = AdmissionService;
