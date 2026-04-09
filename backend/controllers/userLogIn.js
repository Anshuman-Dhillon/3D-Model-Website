import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// POST /auth/login
export async function logInUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!password || (!username && !email)) {
      return res.status(400).json({ message: "Username or email and password are required." });
    }

    const query = {};
    if (username) query["settings.personal_info.username"] = username;
    if (email) query["settings.personal_info.email_address"] = email;

    const user = await User.findOne(
      username && email
        ? { $or: [
            { "settings.personal_info.username": username },
            { "settings.personal_info.email_address": email }
          ]}
        : query
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid username/email or password." });
    }

    const match = await bcrypt.compare(password, user.settings.personal_info.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid username/email or password." });
    }

    const payload = { id: user._id, username: user.settings.personal_info.username };
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_TOKEN, { expiresIn: "3h" });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 3 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.settings.personal_info.username,
        email: user.settings.personal_info.email_address,
        profilePicture: user.settings.personal_info.profile_picture,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
}

// POST /auth/refresh
export async function refreshAccessToken(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.sendStatus(403);

    jwt.verify(token, process.env.REFRESH_SECRET_TOKEN, (err, decoded) => {
      if (err) return res.sendStatus(403);

      const payload = { id: user._id, username: user.settings.personal_info.username };
      const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, { expiresIn: "15m" });

      res.status(200).json({ accessToken });
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Token refresh failed" });
  }
}

// POST /auth/logout
export async function logOutUser(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = "init-refresh-token";
        await user.save();
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Logout failed" });
  }
}
