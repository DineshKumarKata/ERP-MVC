class QuestionDao {
  create = async (questionData) => {
    try {
      console.log("QuestionDao - Inside of create");
      const persistanceData = await questionData.save();
      console.log("QuestionDao - End of create");
      return persistanceData;
    } catch (error) {
      console.error("Question - create ||  Error : ", error.message);
      throw error;
    }
  };
}


module.exports = QuestionDao;
