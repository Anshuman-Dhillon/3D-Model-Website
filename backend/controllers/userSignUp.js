import Model from "../models/model.js";
import User from "../models/user.js";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./controllers.js";
import authenticated from "../middleware/authentication.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export async function createUser(req, res) {
  try {
    const { email, username, password, confirmPassword } = req.body;

    // Basic validation
    if (username.length > 50) throw new Error("Username must be less than 50 characters");
    if (username.length < 4) throw new Error("Username must be more than 4 characters");
    if (password !== confirmPassword) throw new Error("Both passwords must be the same");
    if (password.length < 1) throw new Error("You didn't fill in the passwords section");
    if (password.length > 100) throw new Error("Password too long");

    // Check if user/email exists
    const existingUser = await User.findOne({
      $or: [
        { "settings.personal_info.username": username },
        { "settings.personal_info.email_address": email }
      ]
    });
    if (existingUser) {
      if (existingUser.settings.personal_info.username === username) {
        throw new Error("User with this username already exists!");
      }
      if (existingUser.settings.personal_info.email_address === email) {
        throw new Error("User with this email already exists!");
      }
    }

    // Hash password
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user document, matching schema exactly
    const newUser = new User({
      settings: {
        personal_info: {
          username,
          password: hashedPassword,
          email_address: email,
          profile_picture: "https://example.com/default-profile.png",
        },
        payment_methods: {
          google_pay_accounts: [],
          paypal_accounts: [],
          notification_settings: {
            email_notifications: false,
            push_notifications: false,
            sms_alerts: false,
            newsletter_subscription: false,
          },
        },
      },
      transaction_history: [],
      refreshToken: 'init-refresh-token', // required field with default value
      orders: {
        total_cost: 0,
        items: [],
      },
      posted_models: [],
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: { username, email_address: email } });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
}
