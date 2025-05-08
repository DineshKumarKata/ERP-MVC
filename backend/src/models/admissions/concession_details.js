const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConcessionDetailsSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  adm_no: {
    type: Number,
    required: true,
  },
  concession_subid: {
    type: Number,
    required: true,
  },
  concession_name: {
    type: String,
    required: true,
  },
  concession_prntg: {
    type: Number,
    required: true,
  },
  adm_year: {
    type: Number,
    required: true,
  },
  campus_id: {
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
  tot_concession_prntg: {
    type: Number,
    required: true,
  },
  concession_names: {
    type: String,
    required: true,
    default: "chairman_sir + vice_chairman_sir + Staff_reference + SIBlink_Student + ...", // Default value as per the last record
  },
}, { collection: 'concession_details' });

module.exports = (db) => {
  return db.model('ConcessionDetails', ConcessionDetailsSchema);
};