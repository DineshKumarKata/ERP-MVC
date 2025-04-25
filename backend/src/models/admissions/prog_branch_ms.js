const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BranchSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  branch_id: {
    type: Number,
    required: true,
  },
  pgrm_programme_id: {
    type: Number,
    required: true,
  },
  branch_code: {
    type: String,
    required: true,
  },
  branch_short_name: {
    type: String,
    required: true,
  },
  branch_long_name: {
    type: String,
    required: true,
  },
  branch_seprt_id: {
    type: String,
    required: true,
  },
  branch_mode: {
    type: String,
    required: true,
  },
  branch_category: {
    type: Number,
    required: true,
  },
  cmps_campus_id: {
    type: Number,
    required: true,
  },
  branch_start_year: {
    type: Number,
    required: true,
  },
  regln_mstr_regu_id: {
    type: Number,
    required: true,
  },
  ptrn_mstr_ptrn_id: {
    type: Number,
    required: true,
  },
  cst_cntr_center_id: {
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
}, {collection: 'prog_branch_ms'});

module.exports = mongoose.model('Branch', BranchSchema);