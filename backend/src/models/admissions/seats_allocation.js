const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeatsAllocationSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  admission_no: {
    type: Number,
    required: true,
  },
  vu_id: {
    type: String,
    required: true,
  },
  prgmm_id: {
    type: Number,
    required: true,
  },
  allot_brnch_id: {
    type: Number,
    required: true,
  },
  choice_id: {
    type: String,
    required: true,
  },
  scrshp_id: {
    type: Number,
    required: true,
  },
  constion_id: {
    type: String,
    required: true,
  },
  fee_cat_id: {
    type: Number,
    required: true,
  },
  colg_fee_id: {
    type: Number,
    required: true,
  },
  campus_id: {
    type: Number,
    required: true,
  },
  adm_year: {
    type: Number,
    required: true,
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
}, { collection: 'seats_allocation' });

module.exports = (db) => {
  return db.model('SeatsAllocation', SeatsAllocationSchema);
};
