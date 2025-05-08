const ResultDAO = require("../dao/resultDAO");

class ResultService {
  constructor() {
    this.resultDAO = new ResultDAO();
    this.createSubjectKey = this.createSubjectKey.bind(this);
  }

  createSubjectKey(subjectName) {
    return subjectName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  saveResult = async( studentEmail, testId, slotId ) =>{
    try {
      console.log("ResultService - Inside of saveResult");
      
      // Fetch the test to get subject structure and total marks
      const test = await this.resultDAO.getTestById(testId);
      if (!test) {
        throw new Error("Test not found");
      }

      // Create subject mapping from test
      const subjectMap = {};
      test.subjects.forEach(subject => {
        subjectMap[this.createSubjectKey(subject.name)] = subject;
      });

      // Fetch all answers for this studentEmail and testId
      const studentAnswers = await this.resultDAO.getStudentAnswers({ 
        studentEmail, 
        testId 
      });

      if (!studentAnswers?.length) {
        throw new Error("No answers found for this test");
      }

      // Initialize result tracking
      const resultTracking = {
        totalMarksEarned: 0,
        totalMarksConsidered: test.totalMarks,
        subjects: {}
      };

      // Initialize subject tracking
      test.subjects.forEach(subject => {
        const key = this.createSubjectKey(subject.name);
        resultTracking.subjects[key] = {
          name: subject.name,
          marksEarned: 0,
          totalMarks: subject.totalMarks,
          questionCount: subject.totalQuestions
        };
      });

      // Process all answers to calculate earned marks
      for (const answer of studentAnswers) {
        const question = answer.questionId;
        if (!question) continue;

        const subjectKey = this.createSubjectKey(question.quesubject);
        const subjectData = resultTracking.subjects[subjectKey];

        if (!subjectData) {
          console.warn(`Question ${question._id} has unknown subject: ${question.quesubject}`);
          continue;
        }

        const earnedMarks = answer.ansMarks || 0;
        subjectData.marksEarned += earnedMarks;
        resultTracking.totalMarksEarned += earnedMarks;
      }

      // Calculate accuracy metrics
      const overallAccuracy = resultTracking.totalMarksConsidered > 0 
        ? (resultTracking.totalMarksEarned / resultTracking.totalMarksConsidered) * 100 
        : 0;

      // Prepare result data for database
      const individualSubjectMarks = {};
      Object.entries(resultTracking.subjects).forEach(([key, subject]) => {
        individualSubjectMarks[key] = {
          marksEarned: subject.marksEarned,
          totalMarks: subject.totalMarks,
          questionCount: subject.questionCount
        };
      });

      const resultData = {
        studentEmail,
        testId,
        totalMarksEarned: resultTracking.totalMarksEarned,
        totalMarksConsidered: resultTracking.totalMarksConsidered,
        individualSubjectMarks,
        createdAt: new Date()
      };

      // Check for existing result
      const existingResult = await this.resultDAO.findOne({ studentEmail, testId });
      if (existingResult) {
        throw new Error("Test already submitted - only one submission allowed per test");
      }

      // Create and save new result
      const newResult = await this.resultDAO.create(resultData);

      // Update slot booking status if slotId provided
      if (slotId) {
        await this.resultDAO.updateSlotBooking(
          { studentEmailId: studentEmail, slotId },
          { status: "submitted" }
        );
      }

      // Prepare response with original subject names
      const subjectDetails = {};
      Object.entries(resultTracking.subjects).forEach(([key, subject]) => {
        subjectDetails[subject.name] = {
          marksEarned: subject.marksEarned,
          totalMarks: subject.totalMarks,
          questionCount: subject.questionCount,
          accuracy: subject.totalMarks > 0 
            ? parseFloat(((subject.marksEarned / subject.totalMarks) * 100).toFixed(2))
            : 0
        };
      });

      console.log("ResultService - End of saveResult");
      return {
        result: {
          id: newResult._id,
          testId: newResult.testId,
          studentEmail: newResult.studentEmail,
          totalMarksEarned: newResult.totalMarksEarned,
          totalMarksConsidered: newResult.totalMarksConsidered,
          overallAccuracy: parseFloat(overallAccuracy.toFixed(2)),
          subjects: subjectDetails
        },
        metadata: {
          answersCount: studentAnswers.length,
          testName: test.name,
          testTotalMarks: test.totalMarks,
          testTotalQuestions: test.totalQuestions
        }
      };
    } catch (error) {
      console.error("ResultService - saveResult || Error:", error);
      throw error;
    }
  }

  checkSubmission = async(studentEmail) => {
    try {
      console.log("ResultService - Inside of checkSubmission");
      const existingResult = await this.resultDAO.findOne({ studentEmail });
      console.log("ResultService - End of checkSubmission");
      return {
        hasSubmitted: !!existingResult,
        message: existingResult
          ? "You have already submitted the exam."
          : "Exam not yet submitted."
      };
    } catch (error) {
      console.error("ResultService - checkSubmission || Error:", error);
      throw error;
    }
  }

  getResults = async( studentEmail, testId ) => {
    try {
      console.log("ResultService - Inside of getResults");
      const results = await this.resultDAO.findOne({
        studentEmail,
        testId,
      });

      if (!results) {
        throw new Error("No results found");
      }

      console.log("ResultService - End of getResults");
      return results;
    } catch (error) {
      console.error("ResultService - getResults || Error:", error);
      throw error;
    }
  }
}

module.exports = ResultService;
