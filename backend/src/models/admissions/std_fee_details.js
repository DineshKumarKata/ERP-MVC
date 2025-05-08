const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdmissionFeeSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  admission_no: {
    type: Number,
    required: true,
  },
  category_id: {
    type: String,
    required: true,
  },
  prg_brnch_id: {
    type: Number,
    required: true,
  },
  scrshp_id: {
    type: Number,
    required: true,
  },
  constion_id: {
    type: Number,
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
  adm_fee: {
    type: Number,
    required: true,
  },
  tuition_fee: {
    type: Number,
    required: true,
  },
  discount_fee: {
    type: Number,
    required: true,
  },
  payable_fee: {
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
  seatcatstat: {
    type: Number,
    required: true,
  },
},{collection: 'std_fee_details'});

module.exports = (db) => {
  return db.model('std_fee_details', AdmissionFeeSchema);
};
