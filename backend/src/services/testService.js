const TestDAO = require("../dao/testDAO");
const QuestionBankDAO = require("../dao/questionBankDAO");

class TestService {
  constructor() {
    this.testDAO = new TestDAO();
    this.questionBankDAO = new QuestionBankDAO();
  }

  generateMultiSubjectTest = async (testData) => {
    console.log("TestService - Inside of generateMultiSubjectTest");
    try {
      const { bankId, testName, subjectsData, createdBy, description } =
        testData;

      const subjects = [];
      let totalQuestionsCount = 0;
      let totalDuration = 0;
      let totalMarks = 0;

      const uniqueBankIds = new Set([bankId]);
      subjectsData.forEach((subject) => {
        if (subject.bankId) uniqueBankIds.add(subject.bankId);
      });

      const questionBanks = {};
      for (const id of uniqueBankIds) {
        const bank = await this.questionBankDAO.getById(id);
        if (!bank) {
          throw new Error(`Question bank ${id} not found`);
        }
        questionBanks[id] = bank;
      }

      for (const subjectData of subjectsData) {
        const {
          subjectId,
          difficultyDistribution,
          bankId: subjectBankId,
        } = subjectData;
        const effectiveBankId = subjectBankId || bankId;
        const questionBank = questionBanks[effectiveBankId];

        const subjectQuestions = questionBank.questions.filter(
          (q) =>
            q.quesubject &&
            q.quesubject.toLowerCase() === subjectId.toLowerCase()
        );

        const questionsByDifficulty = {
          easy: subjectQuestions.filter((q) => q.que_level === "easy"),
          average: subjectQuestions.filter((q) => q.que_level === "average"),
          difficult: subjectQuestions.filter(
            (q) => q.que_level === "difficult"
          ),
        };

        const selectedQuestions = { easy: [], average: [], difficult: [] };
        let subjectTotalMarks = 0;
        let subjectTotalQuestions = 0;
        let subjectTotalDuration = 0;

        for (const [difficulty, count] of Object.entries(
          difficultyDistribution
        )) {
          if (count > 0) {
            const availableQuestions = questionsByDifficulty[difficulty];
            if (availableQuestions.length < count) {
              throw new Error(
                `Not enough ${difficulty} questions for subject ${subjectId}. Requested: ${count}, Available: ${availableQuestions.length}`
              );
            }

            const shuffled = [...availableQuestions].sort(
              () => 0.5 - Math.random()
            );
            const selected = shuffled.slice(0, count);

            selected.forEach((question) => {
              subjectTotalDuration += question.qtimesec || 0;
              subjectTotalMarks += question.qmarks || 0;
            });

            selectedQuestions[difficulty] = selected.map((q) => q._id);
            subjectTotalQuestions += selected.length;
          }
        }

        totalQuestionsCount += subjectTotalQuestions;
        totalDuration += subjectTotalDuration;
        totalMarks += subjectTotalMarks;

        subjects.push({
          name: subjectId,
          bankId: effectiveBankId,
          difficultyDistribution,
          questions: {
            easy: selectedQuestions.easy,
            average: selectedQuestions.average,
            difficult: selectedQuestions.difficult,
          },
          totalQuestions: subjectTotalQuestions,
          totalMarks: subjectTotalMarks,
          totalDuration: subjectTotalDuration,
        });
      }

      const newTest = {
        name: testName,
        questionBankId: bankId,
        createdBy,
        subjects,
        totalQuestions: totalQuestionsCount,
        totalDuration,
        totalMarks,
        description: description || `${testName} - Test`,
      };

      const savedTest = await this.testDAO.create(newTest);

      console.log("TestService - End of generateMultiSubjectTest - Success");
      return {
        testId: savedTest._id,
        totalDuration,
        totalMarks,
        subjectsStats: subjects.map((subject) => ({
          name: subject.name,
          distribution: {
            easy: subject.questions.easy.length,
            average: subject.questions.average.length,
            difficult: subject.questions.difficult.length,
          },
          totalQuestions: subject.totalQuestions,
          totalMarks: subject.totalMarks,
          totalDuration: subject.totalDuration,
        })),
        totalQuestions: totalQuestionsCount,
      };
    } catch (error) {
      console.error(
        "TestService - End of generateMultiSubjectTest || Error:",
        error
      );
      throw error;
    }
  };

  getAllTests = async () => {
    console.log("TestService - Inside of getAllTests");
    try {
      const tests = await this.testDAO.getAll();
      console.log("TestService - End of getAllTests - Success");
      return tests;
    } catch (error) {
      console.error("TestService - End of getAllTests || Error:", error);
      throw error;
    }
  };

  getTestById = async (testId) => {
    console.log("TestService - Inside of getTestById");
    try {
      const test = await this.testDAO.getById(testId);
      if (!test) {
        throw new Error("Test not found");
      }

      // Transform image fields in questions to base64
      const testObj = test.toObject();
      testObj.subjects = testObj.subjects.map((subject) => {
        ["easy", "average", "difficult"].forEach((difficulty) => {
          if (subject.questions[difficulty]) {
            subject.questions[difficulty] = subject.questions[difficulty].map(
              (question) => {
                const imageFields = [
                  "questiondesc_image",
                  "option1_image",
                  "option2_image",
                  "option3_image",
                  "option4_image",
                ];

                imageFields.forEach((field) => {
                  if (question[field] && question[field].data) {
                    // Check if data and contentType exist before processing
                    if (question[field].data && question[field].contentType) {
                      const base64 = question[field].data.toString("base64");
                      question[
                        field
                      ].data = `data:${question[field].contentType};base64,${base64}`;
                    }
                  }
                });
                return question;
              }
            );
          }
        });
        return subject;
      });

      console.log("TestService - End of getTestById - Success");
      return testObj;
    } catch (error) {
      console.error("TestService - End of getTestById || Error:", error);
      throw error;
    }
  };
}

module.exports = TestService;
