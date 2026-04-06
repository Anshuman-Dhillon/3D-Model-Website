import Model from "../models/model.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import { attachThumbnailUrls } from "./modelFunctions.js";
import s3 from "../config/s3.js";
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.S3_BUCKET_NAME;

// Helper: generate presigned URL for a profile picture key
async function profilePicUrl(key) {
    if (!key) return "";
    return getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn: 3600 });
}

// POST /cart/:modelId — add model to cart
export async function addCart(req, res) {
    try {
        const userId = req.user.id;
        const { modelId } = req.params;

        const model = await Model.findById(modelId);
        if (!model) return res.status(404).json({ message: "Model not found" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Don't add duplicates
        if (user.orders.items.some(id => id.toString() === modelId)) {
            return res.status(400).json({ message: "Model already in cart" });
        }

        user.orders.items.push(model._id);
        user.orders.total_cost = +(user.orders.total_cost + model.price).toFixed(2);
        await user.save();

        res.status(200).json({ message: "Added to cart", cart: user.orders });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Unable to add to cart", error: error.message });
    }
}

// DELETE /cart/:modelId — remove model from cart
export async function removeCart(req, res) {
    try {
        const userId = req.user.id;
        const { modelId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const model = await Model.findById(modelId);
        const price = model ? model.price : 0;

        user.orders.items = user.orders.items.filter(id => id.toString() !== modelId);
        user.orders.total_cost = Math.max(0, +(user.orders.total_cost - price).toFixed(2));
        await user.save();

        res.status(200).json({ message: "Removed from cart", cart: user.orders });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ message: "Unable to remove from cart", error: error.message });
    }
}

// GET /cart — get user's cart items
export async function getAllCart(req, res) {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate("orders.items");
        if (!user) return res.status(404).json({ message: "User not found" });

        const itemsWithUrls = await attachThumbnailUrls(user.orders.items || []);
        res.status(200).json({
            items: itemsWithUrls,
            total_cost: user.orders.total_cost,
        });
    } catch (error) {
        console.error("Error retrieving cart:", error);
        res.status(500).json({ message: "Error retrieving cart" });
    }
}

// GET /user/models — get user's posted models
export async function userGetAllModels(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate("posted_models");
        if (!user) return res.status(404).json({ message: "User not found" });

        const modelsWithUrls = await attachThumbnailUrls(user.posted_models || []);
        res.status(200).json(modelsWithUrls);
    } catch (error) {
        console.error("Error fetching user models:", error);
        res.status(500).json({ message: "Error fetching models" });
    }
}

// PATCH /user/settings — update personal info
export async function personalInfoChange(req, res) {
    try {
        const userId = req.user.id;
        const { currentPassword, username, email, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isGoogleUser = user.authProvider === "google";

        // Google users don't need current password for username/email changes,
        // but cannot change passwords at all.
        if (isGoogleUser) {
            if (newPassword) {
                return res.status(400).json({ message: "Google account users cannot set a password. Use Google to sign in." });
            }
        } else {
            // Local users must verify current password
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required" });
            }
            const match = await bcrypt.compare(currentPassword, user.settings.personal_info.password);
            if (!match) return res.status(401).json({ message: "Incorrect current password" });
        }

        if (username) user.settings.personal_info.username = username;
        if (email) user.settings.personal_info.email_address = email;
        if (newPassword && !isGoogleUser) {
            const hashed = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUNDS) || 10);
            user.settings.personal_info.password = hashed;
        }

        await user.save();
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.settings.personal_info.username,
                email: user.settings.personal_info.email_address,
            },
        });
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ message: "Error updating settings", error: error.message });
    }
}

// PATCH /user/notifications — update notification preferences
export async function notificationChange(req, res) {
    try {
        const userId = req.user.id;
        const { email_notifications, push_notifications, sms_alerts, newsletter_subscription } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const ns = user.settings.payment_methods.notification_settings;
        if (email_notifications !== undefined) ns.email_notifications = email_notifications;
        if (push_notifications !== undefined) ns.push_notifications = push_notifications;
        if (sms_alerts !== undefined) ns.sms_alerts = sms_alerts;
        if (newsletter_subscription !== undefined) ns.newsletter_subscription = newsletter_subscription;

        await user.save();
        res.status(200).json({
            message: "Notification settings updated",
            notifications: ns,
        });
    } catch (error) {
        console.error("Error updating notifications:", error);
        res.status(500).json({ message: "Error updating notifications", error: error.message });
    }
}

// GET /user/profile — get current user's profile
export async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .populate("posted_models")
            .populate("purchased_models");
        if (!user) return res.status(404).json({ message: "User not found" });

        const postedWithUrls = await attachThumbnailUrls(user.posted_models || []);
        const purchasedWithUrls = await attachThumbnailUrls(user.purchased_models || []);
        const profilePicUrl_ = await profilePicUrl(user.settings.personal_info.profile_picture);

        res.status(200).json({
            id: user._id,
            username: user.settings.personal_info.username,
            email: user.settings.personal_info.email_address,
            profilePicture: profilePicUrl_,
            authProvider: user.authProvider || "local",
            notifications: user.settings.payment_methods.notification_settings,
            postedModels: postedWithUrls,
            purchasedModels: purchasedWithUrls,
            transactions: user.transaction_history,
            followerCount: user.followers?.length || 0,
            followingCount: user.following?.length || 0,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
}

// PUT /user/profile-picture — upload / replace profile picture
export async function uploadProfilePicture(req, res) {
    try {
        const userId = req.user.id;
        const file = req.file;

        if (!file) return res.status(400).json({ message: "No image file provided" });

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({ message: "Only JPEG, PNG, and WebP images are allowed" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Delete old profile picture from S3 if exists
        const oldKey = user.settings.personal_info.profile_picture;
        if (oldKey) {
            await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: oldKey })).catch(() => {});
        }

        // Upload new one
        const ext = file.originalname.split(".").pop();
        const key = `profile-pictures/${userId}-${Date.now()}.${ext}`;
        await s3.send(new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));

        user.settings.personal_info.profile_picture = key;
        await user.save();

        const url = await profilePicUrl(key);
        res.status(200).json({ message: "Profile picture updated", profilePicture: url });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ message: "Error uploading profile picture" });
    }
}