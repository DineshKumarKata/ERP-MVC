const express = require("express");
const router = express.Router();
const studentRoute = require("./studentRoutes");
const questionBankRoutes = require("./QuestionBankRoutes");
const testRoutes = require("./testRoutes");
const admissionRoutes = require("./admissions_routes/admissionsRoutes");
const resultRoutes = require("./resultRoutes");


router.use("/v1/student", studentRoute);
router.use("/questionbank", questionBankRoutes);
router.use("/v1/test", testRoutes);
router.use("/v1/result",resultRoutes);
router.use("/v1/admission", admissionRoutes);

module.exports = router;
