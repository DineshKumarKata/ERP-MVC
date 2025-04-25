const express = require("express");
const router = express.Router();
const studentRoute = require("./studentRoutes");
const questionBankRoutes = require("./QuestionBankRoutes");
const testRoute = require("./testRoutes");
const admissionRoutes = require("./admissions_routes/admissionsRoutes");


router.use("/v1/student", studentRoute);
router.use("/questionbank", questionBankRoutes);
router.use("/v1/test", testRoute);
router.use("/v1/admission", admissionRoutes);

module.exports = router;
