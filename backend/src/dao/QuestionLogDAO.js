class QuestionLogsDao {
  create = async (questionLog) => {
    try {
      console.log("QuestionLogDao - Inside of create");
      const persistanceData = await questionLog.save();
      console.log("QuestionLogDao - End of create");
      return persistanceData;
    } catch (error) {
      console.error("QuestionLog - create ||  Error : ", error.message);
      throw error;
    }
  };
}
module.exports = QuestionLogsDao;
