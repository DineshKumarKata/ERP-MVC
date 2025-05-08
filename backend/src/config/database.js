require('dotenv').config();

const dbConfig = {
  admission: {
    uri: process.env.ADMISSION_DB_URI || 'mongodb+srv://vignanuser:QasQik7m.m2C5Lw@vignanuniversitycluster.tr5ru.mongodb.net/ad_process',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  academic: {
    uri: process.env.ACADEMIC_DB_URI || 'mongodb+srv://vignanuser:QasQik7m.m2C5Lw@vignanuniversitycluster.tr5ru.mongodb.net/ad_master',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  finance: {
    uri: process.env.FINANCE_DB_URI || 'mongodb+srv://vignanuser:QasQik7m.m2C5Lw@vignanuniversitycluster.tr5ru.mongodb.net/ad_finance',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  }
  
  // Add more database configurations as needed
};

module.exports = dbConfig; 