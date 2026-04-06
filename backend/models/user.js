import mongoose from "mongoose";
import { transactionSchema } from "./transaction.js";

const userSchema = new mongoose.Schema(
  {
    transaction_history: {
      type: [transactionSchema],
      required: true,
      min: 0,
      default: []
    },
    refreshToken: {
      type: String,
      required: true,
      default: 'init-refresh-token'
    },
    orders: {
      total_cost: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      items: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Model" }],
        default: [],
      },
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    posted_models: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Model" }],
      default: [],
    },

    purchased_models: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Model" }],
      default: [],
    },

    liked_models: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Model" }],
      default: [],
    },

    followers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    following: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
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
        notification_settings: {
          email_notifications: {
            type: Boolean,
            required: true,
            default: false
          },
          push_notifications: {
            type: Boolean,
            required: true,
            default: false
          },
          sms_alerts: {
            type: Boolean,
            required: true,
            default: false
          },
          newsletter_subscription: {
            type: Boolean,
            required: true,
            default: false
          }
        }
      },

      personal_info: {
        email_address: {
          type: String,
          required: true,
          unique: true,
        },
        profile_picture: {
          type: String,
          default: "",
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