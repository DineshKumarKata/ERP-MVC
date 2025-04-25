const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EntranceExamSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true
  },
  exam_id: {
    type: Number,
    required: true
  },
  programme_id: {
    type: Number,
    required: true
  },
  exam_type: {
    type: Number,
    required: true
  },
  short_desc: {
    type: String
  },
  long_desc: {
    type: String
  },
  campus_id: {
    type: Number,
    required: true
  },
  admission_year: {
    type: Number,
    required: true
  },
  log_userid: {
    type: Number
  },
  log_timestamp: {
    type: Date,
    default: Date.now
  },
  log_ipaddress: {
    type: String
  },
  lock_status: {
    type: Number,
    default: 0
  }
}, {
  collection: 'entrance_exams_m'  // Explicitly set collection name based on your folder structure
});

// Add useful indexes
EntranceExamSchema.index({ exam_id: 1 });
EntranceExamSchema.index({ programme_id: 1 });
EntranceExamSchema.index({ admission_year: 1 });

const EntranceExam = mongoose.model('EntranceExam', EntranceExamSchema);
module.exports = EntranceExam;