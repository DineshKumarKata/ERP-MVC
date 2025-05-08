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

  getSeatsData = async (req, res) => {
    console.log("AdmissionHandler - Inside of getSeatsData");
    try {
      const { branchId, category, concessionPercentage } = req.query;
      
      if (!branchId || !category || concessionPercentage === undefined) {
        return res.status(400).send({
          status: "Failure",
          message: "Missing required parameters",
          code: "400",
          data: {}
        });
      }

      const seatsData = await this.admissionService.getSeatsData(
        branchId,
        category,
        concessionPercentage
      );

      console.log("AdmissionHandler - End of getSeatsData - Success");
      return res.status(200).send({
        status: "Success",
        message: "Seats data retrieved successfully",
        code: "200",
        data: seatsData
      });
    } catch (error) {
      console.error("AdmissionHandler - End of getSeatsData || Error:", error);
      return res.status(500).send({
        status: "Failure",
        message: error.message || "Internal Server Issue. Please try after sometime.",
        code: "500"
      });
    }
  };

  checkStudentIRADMDetails = async (req, res) => {
    console.log("AdmissionHandler - Inside of checkStudentIRADMDetails");
    try {
      const { admission_no } = req.query;
      
      if (!admission_no) {
        return res.status(400).send({
          status: "Failure",
          message: "Missing admission number",
          code: "400",
          data: {}
        });
      }

      const result = await this.admissionService.checkStudentIRADMDetails(admission_no);

      console.log("AdmissionHandler - End of checkStudentIRADMDetails - Success");
      return res.status(200).send({
        status: "Success",
        message: "Student IRADM details checked successfully",
        code: "200",
        data: result
      });
    } catch (error) {
      console.error("AdmissionHandler - End of checkStudentIRADMDetails || Error:", error);
      return res.status(500).send({
        status: "Failure",
        message: error.message || "Internal Server Issue. Please try after sometime.",
        code: "500"
      });
    }
  };

  getFeeCategoryId = async (req, res) => {
    console.log("AdmissionHandler - Inside of getFeeCategoryId");
    try {
      const { prgm_id, fees_description } = req.query;
      
      if (!prgm_id || !fees_description) {
        return res.status(400).send({
          status: "Failure",
          message: "Missing required parameters",
          code: "400",
          data: {}
        });
      }

      const feeCategoryId = await this.admissionService.getFeeCategoryId(prgm_id, fees_description);

      console.log("AdmissionHandler - End of getFeeCategoryId - Success");
      return res.status(200).send({
        status: "Success",
        message: "Fee category ID retrieved successfully",
        code: "200",
        data: feeCategoryId
      });
    } catch (error) {
      console.error("AdmissionHandler - End of getFeeCategoryId || Error:", error);
      return res.status(500).send({
        status: "Failure",
        message: error.message || "Internal Server Issue. Please try after sometime.",
        code: "500"
      });
    }
  };

  getFeeId = async (req, res) => {
    console.log("AdmissionHandler - Inside of getFeeId");
    try {
      const { fee_category_id, prgm_branch_id } = req.query;
      
      if (!fee_category_id || !prgm_branch_id) {
        return res.status(400).send({
          status: "Failure",
          message: "Missing required parameters",
          code: "400",
          data: {}
        });
      }

      const feeId = await this.admissionService.getFeeId(fee_category_id, prgm_branch_id);

      console.log("AdmissionHandler - End of getFeeId - Success");
      return res.status(200).send({
        status: "Success",
        message: "Fee ID retrieved successfully",
        code: "200",
        data: feeId
      });
    } catch (error) {
      console.error("AdmissionHandler - End of getFeeId || Error:", error);
      return res.status(500).send({
        status: "Failure",
        message: error.message || "Internal Server Issue. Please try after sometime.",
        code: "500"
      });
    }
  };

  getFeeDetails = async (req, res) => {
    console.log("AdmissionHandler - Inside of getFeeDetails");
    try {
      const { colg_fees_fee_id } = req.query;
      
      if (!colg_fees_fee_id) {
        return res.status(400).send({
          status: "Failure",
          message: "Missing required parameter: colg_fees_fee_id",
          code: "400",
          data: {}
        });
      }

      const feeDetails = await this.admissionService.getFeeDetails(colg_fees_fee_id);

      console.log("AdmissionHandler - End of getFeeDetails - Success");
      return res.status(200).send({
        status: "Success",
        message: "Fee details retrieved successfully",
        code: "200",
        data: feeDetails
      });
    } catch (error) {
      console.error("AdmissionHandler - End of getFeeDetails || Error:", error);
      return res.status(500).send({
        status: "Failure",
        message: error.message || "Internal Server Issue. Please try after sometime.",
        code: "500"
      });
    }
  };

  getConcessionTypes = async (req, res) => {
    console.log("AdmissionHandler - Inside of getConcessionTypes");
    try {
      const { prgm_id } = req.query;
      
      if (!prgm_id) {
        return res.status(400).send({
          status: "Failure",
          message: "Missing required parameter: prgm_id",
          code: "400",
          data: {}
        });
      }

      const concessionTypes = await this.admissionService.getConcessionTypes(prgm_id);

      console.log("AdmissionHandler - End of getConcessionTypes - Success");
      return res.status(200).send({
        status: "Success",
        message: "Concession types retrieved successfully",
        code: "200",
        data: concessionTypes
      });
    } catch (error) {
      console.error("AdmissionHandler - End of getConcessionTypes || Error:", error);
      return res.status(500).send({
        status: "Failure",
        message: error.message || "Internal Server Issue. Please try after sometime.",
        code: "500"
      });
    }
  };

  postAdmissionDetails = async (req, res) => {
    console.log("AdmissionHandler - Inside of postAdmissionDetails");
    try {
      const  data = req.body;
      const result = await this.admissionService.postAdmissionDetails(data);
      console.log("AdmissionHandler - End of postAdmissionDetails - Success");
      return res.status(200).send({
        status: "Success",
        message: "Admission details posted successfully",
        code: "200",
        data: result
      });
    } catch (error) {
      console.error("AdmissionHandler - End of postAdmissionDetails || Error:", error);
      return res.status(500).send({
        status: "Failure",
        message: error.message || "Internal Server Issue. Please try after sometime.",
        code: "500"
      });
    }
  };
  

}

module.exports = AdmissionHandler;



