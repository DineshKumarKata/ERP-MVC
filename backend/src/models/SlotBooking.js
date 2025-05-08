const mongoose = require("mongoose");

const slotBookingSchema = new mongoose.Schema({
  studentEmailId: {
    type: String,
    required: true,
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExamSlot",
    required: true,
  },
  status: {
    type: String,
    enum: ["not started", "started", "submitted"],
    default: "not started",
    required: true,
  },
});

module.exports = (db) => {
  return db.model("SlotBooking", slotBookingSchema);
};
