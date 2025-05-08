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
  
  getSeatsData = async (branchId, category, concessionPercentage) => {
    console.log("AdmissionService - Inside of getSeatsData");
    try {
      const seatsData = await this.admissionDAO.getSeatsData(branchId, category, parseInt(concessionPercentage));
      console.log("AdmissionService - End of getSeatsData - Success");
      return seatsData;
    } catch (error) {
      console.error("AdmissionService - End of getSeatsData || Error:", error);
      throw error;
    }
  };

  checkStudentIRADMDetails = async (admission_no) => {
    console.log("AdmissionService - Inside of checkStudentIRADMDetails");
    try {
      const result = await this.admissionDAO.checkStudentIRADMDetails(admission_no);
      console.log("AdmissionService - End of checkStudentIRADMDetails - Success");
      return result;
    } catch (error) {
      console.error("AdmissionService - End of checkStudentIRADMDetails || Error:", error);
      throw error;
    }
  };

  getFeeCategoryId = async (prgm_id, fees_description) => {
    console.log("AdmissionService - Inside of getFeeCategoryId");
    try {
      const feeCategoryId = await this.admissionDAO.getFeeCategoryId(prgm_id, fees_description);
      console.log("AdmissionService - End of getFeeCategoryId - Success");
      return feeCategoryId;
    } catch (error) {
      console.error("AdmissionService - End of getFeeCategoryId || Error:", error);
      throw error;
    }
  };

  getFeeId = async (fee_category_id, prgm_branch_id) => {
    console.log("AdmissionService - Inside of getFeeId");
    try {
      const feeId = await this.admissionDAO.getFeeId(fee_category_id, prgm_branch_id);
      console.log("AdmissionService - End of getFeeId - Success");
      return feeId;
    } catch (error) {
      console.error("AdmissionService - End of getFeeId || Error:", error);
      throw error;
    }
  };

  getFeeDetails = async (colg_fees_fee_id) => {
    console.log("AdmissionService - Inside of getFeeDetails");
    try {
      const feeDetails = await this.admissionDAO.getFeeDetails(colg_fees_fee_id);
      console.log("AdmissionService - End of getFeeDetails - Success");
      return feeDetails;
    } catch (error) {
      console.error("AdmissionService - End of getFeeDetails || Error:", error);
      throw error;
    }
  };

  getConcessionTypes = async (prgm_id) => {
    console.log("AdmissionService - Inside of getConcessionTypes");
    try {
      const concessionTypes = await this.admissionDAO.getConcessionTypes(prgm_id);
      console.log("AdmissionService - End of getConcessionTypes - Success");
      return concessionTypes;
    } catch (error) {
      console.error("AdmissionService - End of getConcessionTypes || Error:", error);
      throw error;
    }
  };

  postAdmissionDetails = async (data) => {
    console.log("AdmissionService - Inside of postAdmissionDetails");
    try {
      const result = await this.admissionDAO.postAdmissionDetails(data);
      console.log("AdmissionService - End of postAdmissionDetails - Success");
      return result;
    } catch (error) {
      console.error("AdmissionService - End of postAdmissionDetails || Error:", error);
      throw error;
    }
  };
}

module.exports = AdmissionService;


