const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScholarshipSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
    
  },
  scholarships_id: {
    type: Number,
    required: true,
  },
  exam_id: {
    type: Number,
    required: true,
  },
  prgmm_id: {
    type: Number,
    required: true,
  },
  marks_mode: {
    type: String,
    required: true,
  },
  start_rank_mark: {
    type: Number,
    required: true,
  },
  end_rank_mark: {
    type: Number,
    required: true,
  },
  schlrsp_percentage: {
    type: Number,
    required: true,
  },
  lock_status: {
    type: Number,
    required: true,
    default: 0,
  },
  log_userid: {
    type: Number,
    required: true,
  },
  log_timestamp: {
    type: String, // Stored as string based on the format in JSON
    required: true,
  },
  log_ipaddress: {
    type: String,
    required: true,
  },
}, { collection: 'scholarship_acad' });

module.exports = (db) => {
  return db.model('Scholarship', ScholarshipSchema);
};


