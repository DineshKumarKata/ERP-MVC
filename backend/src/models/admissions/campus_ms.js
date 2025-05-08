const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampusSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  campus_id: {
    type: Number,
    required: true,
  },
  campus_venue_code: {
    type: String,
    required: true,
  },
  campus_code: {
    type: String,
    required: true,
  },
  campus_name: {
    type: String,
    required: true,
  },
  campus_logo: {
    type: String,
    default: null,
  },
  campus_address: {
    type: String,
    required: true,
  },
  year_started: {
    type: Number,
    required: true,
  },
  phone_number_1: {
    type: String, // Stored as string to preserve leading zeros and large numbers
    required: true,
  },
  phone_number_2: {
    type: String,
    required: true,
  },
  email_id: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  poc_name: {
    type: String,
    required: true,
  },
  poc_phone_no: {
    type: String,
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
}, {collection: 'campus_ms'});

module.exports = (db) => {
  return db.model('Campus', CampusSchema);
};


