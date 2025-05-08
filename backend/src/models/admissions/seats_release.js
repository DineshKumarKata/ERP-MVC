const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeatSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  seat_id: {
    type: Number,
    required: true,
  },
  counselling_code: {
    type: String,
    required: true,
  },
  prgm_id: {
    type: Number,
    required: true,
  },
  prgm_branch_id: {
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
  ctrym_category: {
    type: Number,
    required: true,
  },
  seats_mode: {
    type: String,
    required: true,
  },
  over_all_relse: {
    type: Number,
    required: true,
  },
  over_all_utilis: {
    type: Number,
    required: true,
  },
  sub_cat_1_relse: {
    type: Number,
    required: true,
  },
  sub_cat_1_utilis: {
    type: Number,
    required: true,
  },
  sub_cat_2_relse: {
    type: Number,
    required: true,
  },
  sub_cat_2_utilis: {
    type: Number,
    required: true,
  },
  sub_cat_3_relse: {
    type: Number,
    required: true,
  },
  sub_cat_3_utilis: {
    type: Number,
    required: true,
  },
  sub_cat_4_relse: {
    type: Number,
    required: true,
  },
  sub_cat_4_utilis: {
    type: Number,
    required: true,
  },
  sub_cat_5_relse: {
    type: Number,
    required: true,
  },
  sub_cat_5_utilis: {
    type: Number,
    required: true,
  },
  sub_cat_6_relse: {
    type: Number,
    required: true,
  },
  sub_cat_6_utilis: {
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
}, { collection: 'seats_release' });

module.exports= (db) => {
  return db.model('Seat', SeatSchema);
}
