import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// One review per user per model
reviewSchema.index({ model: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
