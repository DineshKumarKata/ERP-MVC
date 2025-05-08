const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuestionSchema = new Schema({
  examtype: {
    type: String,
    required: true,
  },
  quesubject: {
    type: String,
    required: true,
  },
  queunit: {
    type: String,
    required: true,
  },
  que_type: {
    type: String,
    required: true,
  },
  que_level: {
    type: String,
    required: true,
  },
  qno: {
    type: Number,
    required: true,
  },
  questiondesc: {
    type: Schema.Types.Mixed,
    required: true,
    validate: validateOption,
  },
  option1: {
    type: Schema.Types.Mixed,
    required: true,
    validate: validateOption,
  },
  option2: {
    type: Schema.Types.Mixed,
    required: true,
    validate: validateOption,
  },
  option3: {
    type: Schema.Types.Mixed,
    required: true,
    validate: validateOption,
  },
  option4: {
    type: Schema.Types.Mixed,
    required: true,
    validate: validateOption,
  },
  answer: {
    type: Schema.Types.Mixed,
    required: true,
    validate: validateOption,
  },
  qtimesec: {
    type: Number,
    required: true,
  },
  qmarks: {
    type: Number,
    required: true,
  },
  queyear: {
    type: Number,
    required: true,
  },
});

function validateOption(value) {
  if (typeof value === "string") return true;
  if (value && value.ref && mongoose.Types.ObjectId.isValid(value.ref))
    return true;
  throw new Error("Option must be a text string or a valid file reference.");
}
module.exports = mongoose.model("Question", QuestionSchema);
