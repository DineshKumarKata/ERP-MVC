const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  admission_no: {
    type: Number,
    required: true,
  },
  student_name: {
    type: String,
    required: true,
  },
  student_phone_no: {
    type: String, // Stored as string to preserve leading zeros and large numbers
    required: true,
  },
  std_email_id: {
    type: String,
    required: true,
  },
  log_timestamp: {
    type: String, // Stored as string based on the format in JSON
    required: true,
  },
}, {collection: 'student_iradm_details'});

module.exports = (db) => {
  return db.model('Student', StudentSchema);
};

