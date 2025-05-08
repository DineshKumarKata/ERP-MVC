const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentExamSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true
  },
  admission_no: {
    type: Number,
    required: true
  },
  exam_id: {
    type: Number,
    required: true
  },
  prgmm_id: {
    type: Number,
    required: true
  },
  marks_mode: {
    type: Number,
    required: true
  },
  exam_marks: {
    type: Number,
    required: true
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
    type: Number,
    required: true
  },
  log_timestamp: {
    type: Date,
    default: Date.now
  },
  log_ipaddress: {
    type: String
  }
}, {
  collection: 'admission_form'  // Explicitly set collection name based on your folder structure
});

// Add useful indexes
// StudentExamSchema.index({ admission_no: 1 });
// StudentExamSchema.index({ exam_id: 1 });
// StudentExamSchema.index({ admission_year: 1 });

module.exports = (db) => {
  return db.model('StudentExam', StudentExamSchema);
};

