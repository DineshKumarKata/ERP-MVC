const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConcessionSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  concession_subid: {
    type: Number,
    required: true,
  },
  consess_desc: {
    type: String,
    required: true,
  },
  prog_id: {
    type: Number,
    required: true,
  },
  std_type: {
    type: Number,
    required: true,
  },
  campus_id: {
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
}, { collection: 'concession_types' });

module.exports = (db) => {
  return db.model('Concession', ConcessionSchema);
};

