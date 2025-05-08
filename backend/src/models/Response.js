const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResponseSchema = new Schema({
  studentEmail: {
    type: String,
    required: true,
    trim: true,
  },
  testId: {
    type: Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  questionBankId: {
    type: Schema.Types.ObjectId,
    ref: "QuestionBankModel",
    required: true,
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: "QuestionModel",
    required: true,
  },
  selectedOption: {
    type: String,
    required: true,
    enum: ["A", "B", "C", "D"], // Restrict to valid options
  },
  correctOption: {
    type: String,
    required: true,
    enum: ["A", "B", "C", "D"],
  },
  ansMarks: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = (db) => {
  return db.model("Response", ResponseSchema);
};

