const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdGeneratorSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  campus_id: {
    type: Number,
    required: true,
  },
  project_id: {
    type: Number,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  start_data_year: {
    type: Number,
    required: true,
  },
  table_name: {
    type: String,
    required: true,
  },
  column_name: {
    type: String,
    required: true,
  },
  prefix_characters: {
    type: String,
    required: true,
  },
  number_length: {
    type: Number,
    required: true,
  },
  start_no: {
    type: Number,
    required: true,
  },
  end_no: {
    type: Number,
    required: true,
  },
  remark: {
    type: String,
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
  calender_year: {
    type: Number,
    required: true,
  },
}, { collection: 'id_generators' });

module.exports = (db) => {
  return db.model('IdGenerator', IdGeneratorSchema);
};
