const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../../middleware/authorizationFilter");
const handlers = require("../../middleware/admissionHandlerWrapper");

router.get("/getAllAdmissions", [handlers.getAllAdmissions]);

router.get("/seats-data", [handlers.getSeatsData]);

router.get("/checkStudentIRADMDetails", [handlers.checkStudentIRADMDetails]);


router.get("/getFeeCategoryId", [handlers.getFeeCategoryId]);
router.get("/getFeeId", [handlers.getFeeId]);
router.get("/getFeeDetails", [handlers.getFeeDetails]);
router.get("/getConcessionTypes", [handlers.getConcessionTypes]);

router.post("/postAdmissionDetails", [handlers.postAdmissionDetails]);

module.exports = router;



