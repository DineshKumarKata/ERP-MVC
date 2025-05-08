const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionlogsSchema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Questionlogs = mongoose.model("Questionlogs", QuestionlogsSchema);
module.exports = Questionlogs;
