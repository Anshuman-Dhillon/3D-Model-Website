import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // for generating unique IDs

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
      default: uuidv4, // automatically generate unique UUID
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
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
