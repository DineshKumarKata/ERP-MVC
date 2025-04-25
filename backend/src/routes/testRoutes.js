const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../middleware/authorizationFilter");
const handlers = require("../middleware/testHandlerWrapper");

router.post("/generate-multi", [verifyjwt, handlers.generateMultiSubjectTest]);
router.get("/", [handlers.getAllTests]);
router.get("/:id", [handlers.getTestById]); // New route for specific test

module.exports = router;
