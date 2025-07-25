import Model from "../models/model.js";
import User from "../models/user.js";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./controllers.js";
import authenticated from "../middleware/authentication.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from 'jsonwebtoken';


// Load environment variables from .env file
dotenv.config()

// in the form, we have the user name, and password boxes
//Route: /users/login/:username/:email/:password

export async function logInUser(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validate input exists
    if (!password || (!username && !email)) {
      return res.status(400).json({ message: "Username or email and password are required." });
    }

    // Search user by username or email in nested personal_info
    const user = await User.findOne({
      $or: [
        { "settings.personal_info.username": username },
        { "settings.personal_info.email_address": email }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username/email or password." });
    }

    // Compare password with nested hashed password
    const match = await bcrypt.compare(password, user.settings.personal_info.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid username/email or password." });
    }

    // Prepare payload and tokens
    const payload = { id: user._id, username: user.settings.personal_info.username };
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_TOKEN, { expiresIn: '3h' });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 3 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.settings.personal_info.username,
        email: user.settings.personal_info.email_address,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
}
