const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeeSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  fee_id: {
    type: Number,
    required: true,
  },
  fee_category_id: {
    type: Number,
    required: true,
  },
  admission_year: {
    type: Number,
    required: true,
  },
  prgrm_branch_id: {
    type: Number,
    required: true,
  },
  campus_code: {
    type: Number,
    required: true,
  },
  no_of_term: {
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
}, {collection: 'college_fees'});

module.exports = (db) => {
  return db.model('Fee', FeeSchema);
};
