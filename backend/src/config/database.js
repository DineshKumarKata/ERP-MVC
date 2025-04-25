require('dotenv').config();

const dbConfig = {
  admission: {
    uri: process.env.ADMISSION_DB_URI || 'mongodb://localhost:27017/admissionDB',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  academic: {
    uri: process.env.ACADEMIC_DB_URI || 'mongodb://localhost:27017/academicDB',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  // Add more database configurations as needed
};

module.exports = dbConfig; 