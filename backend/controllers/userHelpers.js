import User from "../models/user.js";
import Model from "../models/model.js";
import s3 from "../config/s3.js";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.S3_BUCKET_NAME;

// GET /users — get all users (admin)
export async function getAllUsers(req, res) {
    try {
        const users = await User.find({}).select("-settings.personal_info.password -refreshToken");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
}

// GET /users/discover — public user discovery (paginated, sorted by popularity)
export async function discoverUsers(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
        const sort = req.query.sort || "popular"; // popular | newest | models
        const search = req.query.q?.trim() || "";

        const filter = {};
        if (search) {
            filter["settings.personal_info.username"] = { $regex: search, $options: "i" };
        }

        let sortOption = {};
        if (sort === "newest") sortOption = { createdAt: -1 };
        else if (sort === "models") sortOption = { "posted_models": -1 };
        else sortOption = { followers: -1 }; // popular — most followers

        const [users, totalCount] = await Promise.all([
            User.find(filter)
                .select("settings.personal_info.username settings.personal_info.profile_picture followers posted_models createdAt")
                .sort(sortOption)
                .skip((page - 1) * limit)
                .limit(limit),
            User.countDocuments(filter),
        ]);

        // Generate presigned URLs for profile pictures
        const result = await Promise.all(users.map(async (u) => {
            let picUrl = "";
            if (u.settings.personal_info.profile_picture) {
                picUrl = await getSignedUrl(s3, new GetObjectCommand({
                    Bucket: BUCKET, Key: u.settings.personal_info.profile_picture,
                }), { expiresIn: 3600 }).catch(() => "");
            }
            return {
                id: u._id,
                username: u.settings.personal_info.username,
                profilePicture: picUrl,
                followerCount: u.followers?.length || 0,
                modelCount: u.posted_models?.length || 0,
                createdAt: u.createdAt,
            };
        }));

        res.status(200).json({
            users: result,
            page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
        });
    } catch (error) {
        console.error("Error discovering users:", error);
        res.status(500).json({ message: "Error discovering users", error: error.message });
    }
}

// GET /users/:id — get user by id (public profile)
export async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.id)
            .select("-settings.personal_info.password -refreshToken")
            .populate("posted_models");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let picUrl = "";
        if (user.settings.personal_info.profile_picture) {
            picUrl = await getSignedUrl(s3, new GetObjectCommand({
                Bucket: BUCKET, Key: user.settings.personal_info.profile_picture,
            }), { expiresIn: 3600 });
        }

        res.status(200).json({
            id: user._id,
            username: user.settings.personal_info.username,
            profilePicture: picUrl,
            postedModels: user.posted_models,
            followerCount: user.followers?.length || 0,
            followingCount: user.following?.length || 0,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
}

// DELETE /users — delete own account (authenticated)
export async function deleteUser(req, res) {
    try {
        const userId = req.user.id;

        // Delete all user's models and their S3 files
        const userModels = await Model.find({ seller: userId });
        for (const model of userModels) {
            if (model.fileKey) {
                await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: model.fileKey })).catch(() => {});
            }
            if (model.thumbnailKey) {
                await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: model.thumbnailKey })).catch(() => {});
            }
        }
        await Model.deleteMany({ seller: userId });

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Clean up profile picture from S3
        const profilePicKey = deletedUser.settings?.personal_info?.profile_picture;
        if (profilePicKey) {
            await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: profilePicKey })).catch(() => {});
        }

        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
}