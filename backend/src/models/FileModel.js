const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  file: {
    type: Buffer, // Store file as binary (BLOB)
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("File", fileSchema);
