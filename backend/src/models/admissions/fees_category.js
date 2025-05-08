const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeeCategorySchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  fee_category_id: {
    type: Number,
    required: true,
  },
  fees_description: {
    type: String,
    required: true,
  },
  student_category_id: {
    type: Number,
    required: true,
  },
  prgrm_id: {
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
  campus_id: {
    type: Number,
    required: true,
  },
}, {collection: 'fees_category'});

module.exports = (db) => {
  return db.model('FeeCategory', FeeCategorySchema);
};
