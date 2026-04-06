import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// POST /auth/signup
export async function createUser(req, res) {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (!email || !username || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (username.length > 50) return res.status(400).json({ message: "Username must be less than 50 characters" });
    if (username.length < 4) return res.status(400).json({ message: "Username must be at least 4 characters" });
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    if (password.length > 100) return res.status(400).json({ message: "Password too long" });

    const existingUser = await User.findOne({
      $or: [
        { "settings.personal_info.username": username },
        { "settings.personal_info.email_address": email }
      ]
    });

    if (existingUser) {
      if (existingUser.settings.personal_info.username === username) {
        return res.status(409).json({ message: "Username already taken" });
      }
      if (existingUser.settings.personal_info.email_address === email) {
        return res.status(409).json({ message: "Email already registered" });
      }
    }

    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      settings: {
        personal_info: {
          username,
          password: hashedPassword,
          email_address: email,
          profile_picture: "",
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
      refreshToken: "init-refresh-token",
      orders: { total_cost: 0, items: [] },
      posted_models: [],
      purchased_models: [],
    });

    await newUser.save();

    // Auto-login after signup — issue tokens
    const payload = { id: newUser._id, username };
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_TOKEN, { expiresIn: "3h" });

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created successfully",
      user: { id: newUser._id, username, email },
      accessToken,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
}