const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResultSchema = new Schema({
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
  totalMarksEarned: {
    type: Number,
    required: true,
    default: 0,
  },
  totalMarksConsidered: {
    type: Number,
    required: true,
    default: 0,
  },
  individualSubjectMarks: {
    type: Map,
    of: new Schema({
      marksEarned: {
        type: Number,
        default: 0
      },
      // Store the total marks for each subject
      totalMarks: {
        type: Number,
        default: 0
      },
      questionCount: {
        type: Number,
        default: 0
      }
    }),
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add compound unique index for studentEmail and testId
ResultSchema.index(
  { studentEmail: 1, testId: 1 }, 
  { unique: true }
);

module.exports = (db) => {
  return db.model("Result", ResultSchema);
};

