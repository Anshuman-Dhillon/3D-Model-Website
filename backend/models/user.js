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
    refreshToken: {
      type: String,
      required: true,
      default: ''
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
          default: "https://example.com/default-profile.png", // optional
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