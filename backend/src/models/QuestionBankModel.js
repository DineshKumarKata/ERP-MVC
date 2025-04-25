const mongoose = require("../dao/MongooseConfig").mongoose;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const QuestionBankSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  questions: [
    {
      type: ObjectId,
      ref: "Question",
      required: true,
    },
  ],
});

module.exports = mongoose.model("QuestionBank", QuestionBankSchema);
