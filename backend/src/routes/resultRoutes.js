const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../middleware/authorizationFilter");
const resultHandlers = require("../handlers/resultHandlers");

router.post("/save", [verifyjwt, resultHandlers.saveResult]);
router.get("/check-submission", [verifyjwt, resultHandlers.checkSubmission]);
router.get("/get-results/:testId", [verifyjwt, resultHandlers.getResults]);

module.exports = router;