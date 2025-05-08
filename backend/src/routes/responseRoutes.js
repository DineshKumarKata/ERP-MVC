const express = require("express");
const router = express.Router();
const { verifyjwt } = require("../middleware/authorizationFilter");
const handlers = require("../middleware/responseHandlerWrapper");

// POST: Save a student's response
router.post("/save", [verifyjwt, handlers.saveResponse]);

// GET: Fetch all responses for a student and test
router.get("/", [verifyjwt, handlers.getAllResponses]);

// GET: Fetch specific responses (questionId and selectedOption) for a student and test
router.get("/specific", [verifyjwt, handlers.getSpecificResponse]);

// DELETE: Delete a student's response
router.delete("/delete", [verifyjwt, handlers.deleteResponse]);

module.exports = router;
