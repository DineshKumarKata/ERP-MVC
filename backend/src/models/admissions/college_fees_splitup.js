const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollegeFeeSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  colg_fees_fee_id: {
    type: Number,
    required: true,
  },
  fesbgps_subgroup_id: {
    type: Number,
    required: true,
  },
  fee_term: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currencies_code: {
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
}, {collection: 'college_fees_splitup'});

module.exports = (db) => {
  return db.model('CollegeFee', CollegeFeeSchema);
};
