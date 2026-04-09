import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /auth/google — Google OAuth login/signup
export async function googleAuth(req, res) {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: "Google credential is required" });
        }

        // Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        if (!email) {
            return res.status(400).json({ message: "Google account must have an email" });
        }

        // Check if user exists
        let user = await User.findOne({ "settings.personal_info.email_address": email });

        if (!user) {
            // Auto-register new Google user
            const username = name?.replace(/\s+/g, "_").substring(0, 50) || `user_${googleId.substring(0, 8)}`;

            // Ensure unique username
            let finalUsername = username;
            let counter = 1;
            while (await User.findOne({ "settings.personal_info.username": finalUsername })) {
                finalUsername = `${username}_${counter}`;
                counter++;
            }

            user = new User({
                authProvider: "google",
                settings: {
                    personal_info: {
                        username: finalUsername,
                        password: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), Number(process.env.SALT_ROUNDS) || 10), // random hashed password — Google users can't log in via password
                        email_address: email,
                        profile_picture: picture || "",
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
        }

        // Issue JWT tokens
        const jwtPayload = { id: user._id, username: user.settings.personal_info.username };
        const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_SECRET_TOKEN, { expiresIn: "15m" });
        const refreshToken = jwt.sign(jwtPayload, process.env.REFRESH_SECRET_TOKEN, { expiresIn: "3h" });

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 3 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Google authentication successful",
            user: {
                id: user._id,
                username: user.settings.personal_info.username,
                email: user.settings.personal_info.email_address,
                profilePicture: user.settings.personal_info.profile_picture,
                authProvider: "google",
            },
            accessToken,
        });
    } catch (error) {
        console.error("Google auth error:", error);
        res.status(401).json({ message: "Google authentication failed", error: error.message });
    }
}
