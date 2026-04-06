import Model from "../models/model.js";
import User from "../models/user.js";
import s3 from "../config/s3.js";
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.S3_BUCKET_NAME;

// Escape special regex characters to prevent ReDoS / injection
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Helper: generate fresh presigned thumbnail URLs for an array of models
export async function attachThumbnailUrls(models) {
    return Promise.all(models.map(async (m) => {
        const obj = m.toObject ? m.toObject() : { ...m };
        if (obj.thumbnailKey) {
            obj.thumbnailUrl = await getSignedUrl(s3, new GetObjectCommand({
                Bucket: BUCKET,
                Key: obj.thumbnailKey,
            }), { expiresIn: 3600 });
        }
        // Generate presigned URLs for all images
        if (obj.imageKeys?.length) {
            obj.imageUrls = await Promise.all(obj.imageKeys.map(key =>
                getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn: 3600 })
            ));
        }
        return obj;
    }));
}

// GET /models
export async function getAllModels(req, res) {
    try {
        const models = await Model.find({}).sort({ createdAt: -1 });
        const withUrls = await attachThumbnailUrls(models);
        res.status(200).json(withUrls);
    } catch (error) {
        console.error("Error fetching models:", error);
        res.status(500).json({ message: "Error fetching models", error: error.message });
    }
}

// GET /models/search?q=&category=&minPrice=&maxPrice=&sort=&page=&limit=
export async function searchModels(req, res) {
    try {
        const { q, category, format, minPrice, maxPrice, minRating, sort, page, limit } = req.query;
        const filter = {};

        if (q) {
            const safeQ = escapeRegex(q);
            filter.$or = [
                { name: { $regex: safeQ, $options: "i" } },
                { description: { $regex: safeQ, $options: "i" } },
                { sellerName: { $regex: safeQ, $options: "i" } },
            ];
        }
        if (category && category !== "All") {
            filter.category = category;
        }
        if (format && format !== "All") {
            filter.format = { $regex: new RegExp(`^${escapeRegex(format)}$`, "i") };
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (minRating) {
            filter.averageRating = { $gte: Number(minRating) };
        }

        let sortOption = { createdAt: -1 };
        if (sort === "price_asc") sortOption = { price: 1 };
        if (sort === "price_desc") sortOption = { price: -1 };
        if (sort === "popular") sortOption = { downloads: -1 };
        if (sort === "top_rated") sortOption = { averageRating: -1, reviewCount: -1 };
        if (sort === "most_liked") sortOption = { likes: -1 };

        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
        const skip = (pageNum - 1) * limitNum;

        const [models, totalCount] = await Promise.all([
            Model.find(filter).sort(sortOption).skip(skip).limit(limitNum),
            Model.countDocuments(filter),
        ]);

        const withUrls = await attachThumbnailUrls(models);
        res.status(200).json({
            models: withUrls,
            page: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalCount,
        });
    } catch (error) {
        console.error("Error searching models:", error);
        res.status(500).json({ message: "Error searching models", error: error.message });
    }
}

// GET /models/:id
export async function getModelById(req, res) {
    try {
        const model = await Model.findById(req.params.id);
        if (!model) {
            return res.status(404).json({ message: "Model not found" });
        }
        const [withUrl] = await attachThumbnailUrls([model]);
        res.status(200).json(withUrl);
    } catch (error) {
        console.error("Error fetching model:", error);
        res.status(500).json({ message: "Error fetching model", error: error.message });
    }
}

// POST /models  (authenticated, with file upload)
export async function createModel(req, res) {
    try {
        const { name, description, price, category, format } = req.body;
        const userId = req.user.id;

        if (!name || !description || price === undefined || !category || !format) {
            return res.status(400).json({ message: "All fields are required: name, description, price, category, format" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        let fileKey = "";
        let thumbnailKey = "";
        let thumbnailUrl = "";

        // Upload 3D model file to S3
        if (req.files?.modelFile?.[0]) {
            const file = req.files.modelFile[0];
            fileKey = `models/${userId}/${Date.now()}-${file.originalname}`;
            await s3.send(new PutObjectCommand({
                Bucket: BUCKET,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            }));
        }

        // Upload thumbnail to S3
        if (req.files?.thumbnail?.[0]) {
            const thumb = req.files.thumbnail[0];
            thumbnailKey = `thumbnails/${userId}/${Date.now()}-${thumb.originalname}`;
            await s3.send(new PutObjectCommand({
                Bucket: BUCKET,
                Key: thumbnailKey,
                Body: thumb.buffer,
                ContentType: thumb.mimetype,
            }));
        }

        // Upload multiple images to S3
        const imageKeys = [];
        if (req.files?.images?.length) {
            for (const img of req.files.images) {
                const key = `images/${userId}/${Date.now()}-${img.originalname}`;
                await s3.send(new PutObjectCommand({
                    Bucket: BUCKET,
                    Key: key,
                    Body: img.buffer,
                    ContentType: img.mimetype,
                }));
                imageKeys.push(key);
            }
        }

        const newModel = new Model({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            category,
            format,
            seller: userId,
            sellerName: user.settings.personal_info.username,
            fileKey,
            thumbnailKey,
            thumbnailUrl,
            imageKeys,
        });

        const savedModel = await newModel.save();

        // Add model to user's posted_models
        user.posted_models.push(savedModel._id);
        await user.save();

        res.status(201).json(savedModel);
    } catch (error) {
        console.error("Error creating model:", error);
        res.status(500).json({ message: "Error creating model", error: error.message });
    }
}

// PUT /models/:id (authenticated, owner only)
export async function updateModel(req, res) {
    try {
        const model = await Model.findById(req.params.id);
        if (!model) return res.status(404).json({ message: "Model not found" });

        if (model.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to edit this model" });
        }

        const { name, description, price, category, format } = req.body;
        if (name) model.name = name.trim();
        if (description) model.description = description.trim();
        if (price !== undefined) model.price = Number(price);
        if (category) model.category = category;
        if (format) model.format = format;

        // Replace thumbnail if new one uploaded
        if (req.files?.thumbnail?.[0]) {
            if (model.thumbnailKey) {
                await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: model.thumbnailKey }));
            }
            const thumb = req.files.thumbnail[0];
            model.thumbnailKey = `thumbnails/${req.user.id}/${Date.now()}-${thumb.originalname}`;
            await s3.send(new PutObjectCommand({
                Bucket: BUCKET,
                Key: model.thumbnailKey,
                Body: thumb.buffer,
                ContentType: thumb.mimetype,
            }));

        }

        // Replace model file if new one uploaded
        if (req.files?.modelFile?.[0]) {
            if (model.fileKey) {
                await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: model.fileKey }));
            }
            const file = req.files.modelFile[0];
            model.fileKey = `models/${req.user.id}/${Date.now()}-${file.originalname}`;
            await s3.send(new PutObjectCommand({
                Bucket: BUCKET,
                Key: model.fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            }));
        }

        // Handle images: keep existing ones the user didn't remove, add new ones
        const keepExistingImages = req.body.keepExistingImages
            ? JSON.parse(req.body.keepExistingImages)
            : [];

        // Determine which existing imageKeys to keep (match by URL patterns)
        const oldKeys = model.imageKeys || [];
        let keptKeys = [];
        if (keepExistingImages.length > 0 && oldKeys.length > 0) {
            // keepExistingImages are presigned URLs; match them to keys by checking if the key is in the URL
            keptKeys = oldKeys.filter(key =>
                keepExistingImages.some(url => url.includes(encodeURIComponent(key)) || url.includes(key))
            );
        }

        // Delete removed images from S3
        const removedKeys = oldKeys.filter(k => !keptKeys.includes(k));
        for (const key of removedKeys) {
            await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key })).catch(() => {});
        }

        // Upload new images
        const newImageKeys = [];
        if (req.files?.images?.length) {
            for (const img of req.files.images) {
                const key = `images/${req.user.id}/${Date.now()}-${img.originalname}`;
                await s3.send(new PutObjectCommand({
                    Bucket: BUCKET,
                    Key: key,
                    Body: img.buffer,
                    ContentType: img.mimetype,
                }));
                newImageKeys.push(key);
            }
        }

        model.imageKeys = [...keptKeys, ...newImageKeys];

        const updatedModel = await model.save();
        res.status(200).json(updatedModel);
    } catch (error) {
        console.error("Error updating model:", error);
        res.status(500).json({ message: "Error updating model", error: error.message });
    }
}

// DELETE /models/:id (authenticated, owner only)
export async function deleteModel(req, res) {
    try {
        const model = await Model.findById(req.params.id);
        if (!model) return res.status(404).json({ message: "Model not found" });

        if (model.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this model" });
        }

        // Delete files from S3
        if (model.fileKey) {
            await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: model.fileKey }));
        }
        if (model.thumbnailKey) {
            await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: model.thumbnailKey }));
        }
        for (const key of model.imageKeys || []) {
            await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
        }

        // Remove from user's posted_models
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { posted_models: model._id }
        });

        await Model.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Model deleted successfully" });
    } catch (error) {
        console.error("Error deleting model:", error);
        res.status(500).json({ message: "Error deleting model", error: error.message });
    }
}

// GET /models/:id/download (authenticated, must have purchased)
export async function downloadModel(req, res) {
    try {
        const model = await Model.findById(req.params.id);
        if (!model) return res.status(404).json({ message: "Model not found" });

        // Check if user is the seller or has purchased the model
        const user = await User.findById(req.user.id);
        const isSeller = model.seller.toString() === req.user.id;
        const hasPurchased = user.purchased_models.some(id => id.toString() === model._id.toString());

        if (!isSeller && !hasPurchased) {
            return res.status(403).json({ message: "You must purchase this model to download it" });
        }

        if (!model.fileKey) {
            return res.status(404).json({ message: "No file available for this model" });
        }

        // Generate presigned download URL (valid for 1 hour)
        const url = await getSignedUrl(s3, new GetObjectCommand({
            Bucket: BUCKET,
            Key: model.fileKey,
        }), { expiresIn: 3600 });

        // Increment download count
        model.downloads += 1;
        await model.save();

        res.status(200).json({ downloadUrl: url });
    } catch (error) {
        console.error("Error generating download URL:", error);
        res.status(500).json({ message: "Error generating download URL", error: error.message });
    }
}

// GET /models/:id/preview — public presigned URL for 3D viewer (short-lived, no download tracking)
export async function previewModel(req, res) {
    try {
        const model = await Model.findById(req.params.id);
        if (!model) return res.status(404).json({ message: "Model not found" });

        if (!model.fileKey) {
            return res.status(404).json({ message: "No file available for this model" });
        }

        // Stream the file directly through the server to avoid S3 CORS issues
        const command = new GetObjectCommand({ Bucket: BUCKET, Key: model.fileKey });
        const s3Response = await s3.send(command);

        // Map format to MIME type for the browser
        const mimeTypes = {
            glb: "model/gltf-binary",
            gltf: "model/gltf+json",
            obj: "text/plain",
            fbx: "application/octet-stream",
            stl: "application/octet-stream",
        };
        const fmt = (model.format || "").toLowerCase();
        const contentType = mimeTypes[fmt] || "application/octet-stream";

        res.set({
            "Content-Type": contentType,
            "Content-Disposition": "inline",
            "Cache-Control": "private, max-age=900",
        });
        if (s3Response.ContentLength) {
            res.set("Content-Length", String(s3Response.ContentLength));
        }

        // Pipe the S3 readable stream to the response
        s3Response.Body.pipe(res);
    } catch (error) {
        console.error("Error streaming preview:", error);
        res.status(500).json({ message: "Error streaming preview", error: error.message });
    }
}