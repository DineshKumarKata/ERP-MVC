const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdmissionStatusSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  admission_no: {
    type: Number,
    required: true,
  },
  personal_profile: {
    type: Number,
    required: true,
  },
  edu_profile: {
    type: Number,
    required: true,
  },
  choices_filling: {
    type: Number,
    required: true,
  },
  adm_ofc_deo_status: {
    type: Number,
    required: true,
  },
  seat_allocation: {
    type: Number,
    required: true,
  },
  admission_fee: {
    type: Number,
    required: true,
  },
  finance_office: {
    type: Number,
    required: true,
  },
  admission_letter: {
    type: Number,
    required: true,
  },
  reger_no: {
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
  adm_year: {
    type: Number,
    required: true,
  },
  deo_userid: {
    type: Number,
    required: true,
  },
}, { collection: 'admission_status' });

module.exports = (db) => {
  return db.model('admission_status', AdmissionStatusSchema);
};

