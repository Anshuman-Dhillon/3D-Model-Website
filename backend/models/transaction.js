import mongoose from "mongoose";

// Schema to hold the info about each transaction
export const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to your user model
      required: true,
    },
    platform: {
      type: String,
      enum: ["PayPal", "GooglePay"],
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // optional: to store platform-specific data
    }
  },
  { timestamps: true }
);

const modelFile = mongoose.model("Transaction", transactionSchema);
export default modelFile;
