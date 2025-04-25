const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TestSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  questionBankId: {
    // This remains as the primary/default bank ID
    type: Schema.Types.ObjectId,
    ref: "QuestionBank",
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  subjects: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      bankId: {
        // Add this field to store the bank ID for each subject
        type: Schema.Types.ObjectId,
        ref: "QuestionBank",
        required: true,
      },
      difficultyDistribution: {
        easy: {
          type: Number,
          default: 0,
        },
        average: {
          type: Number,
          default: 0,
        },
        difficult: {
          type: Number,
          default: 0,
        },
      },
      questions: {
        easy: [
          {
            type: Schema.Types.ObjectId,
            ref: "Question",
          },
        ],
        average: [
          {
            type: Schema.Types.ObjectId,
            ref: "Question",
          },
        ],
        difficult: [
          {
            type: Schema.Types.ObjectId,
            ref: "Question",
          },
        ],
      },
      totalMarks: {
        type: Number,
        default: 0,
      },
      totalQuestions: {
        type: Number,
        default: 0,
      },
    },
  ],
  totalQuestions: {
    type: Number,
    required: true,
  },
  totalDuration: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalMarks: {
    type: Number,
    required: true,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Test", TestSchema);
