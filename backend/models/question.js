import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
  },
  { timestamps: true }
);

questionSchema.index({ model: 1, createdAt: -1 });

const Question = mongoose.model("Question", questionSchema);
export default Question;
