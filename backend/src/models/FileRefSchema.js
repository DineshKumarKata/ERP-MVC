const mongoose = require("mongoose");

const fileRefSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  ref: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
});

module.exports = fileRefSchema;