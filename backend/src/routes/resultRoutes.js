const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../middleware/authorizationFilter");
const handlers = require("../middleware/resultHandlerWrapper");

router.post("/save-result", [verifyjwt, handlers.saveResult]);

module.exports = router;