const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChoiceFillingSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  admission_no: {
    type: Number, // Stored as string to preserve large numbers and leading zeros
    required: true,
  },
  adm_year: {
    type: Number,
    required: true,
  },
  vu_id: {
    type: String,
    required: true,
  },
  admission_mode: {
    type: String,
    required: true,
  },
  adm_status: {
    type: Number,
    required: true,
    default: 0,
  },
  campus_id: {
    type: Number,
    required: true,
  },
  choice_id: {
    type: String,
    required: true,
  },
  ch_1_brnh_id: {
    type: Number,
    required: true,
  },
  ch_2_brnh_id: {
    type: Number,
    required: true,
  },
  ch_3_brnh_id: {
    type: Number,
    required: true,
  },
  exam_id: {
    type: Number,
    required: true,
  },
  log_timestamp: {
    type: String, // Stored as string based on the format in JSON
    required: true,
  },
}, {collection: 'choice_filling'});

module.exports = (db) => {
  return db.model('ChoiceFilling', ChoiceFillingSchema);
};



