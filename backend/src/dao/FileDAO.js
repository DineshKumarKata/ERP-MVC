const fileModel = require("../models/FileModel");

class FileDAO {
  create = async (fileData) => {
    try {
      console.log("FileDao - Inside of create");
      const persistanceData = await fileData.save();
      console.log("FileDao - End of create");
      return persistanceData;
    } catch (error) {
      console.error("FileDAO - create ||  Error : ", error.message);
      throw error;
    }
  };
}

module.exports = FileDAO;
