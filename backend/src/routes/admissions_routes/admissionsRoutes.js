const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../../middleware/authorizationFilter");
const handlers = require("../../middleware/admissionHandlerWrapper");

router.get("/getAllAdmissions", [handlers.getAllAdmissions]);

module.exports = router;
