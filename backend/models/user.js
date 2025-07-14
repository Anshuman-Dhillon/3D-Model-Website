import mongoose from "mongoose";
import { modelSchema } from "./model.js";
import { transactionSchema } from "./transaction.js";

const userSchema = new mongoose.Schema(
  {
    transaction_history: {
      type: [transactionSchema],
      required: true,
      min: 0,
      default: []
    },

    orders: {
      total_cost: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      items: {
        type: [modelSchema],  // embed array of model schemas
        default: [],
      },
    },

    posted_models: {
      type: [modelSchema],
      default: [],
    },

    settings: {
      payment_methods: {
        google_pay_accounts: {
          type: [String],
          default: [],
        },
        paypal_accounts: {
          type: [String],
          default: [],
        },
      },

      personal_info: {
        email_address: {
          type: String,
          required: true,
          unique: true,
        },
        username: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
          required: true,
        },
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;