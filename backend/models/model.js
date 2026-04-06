import mongoose from "mongoose";

//This is supposed to store everything about the listing, including info 
//about the file of the 3d model, name, description, etc.
export const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    // S3 keys for uploaded files
    fileKey: {
      type: String,
      default: "",
    },
    thumbnailKey: {
      type: String,
      default: "",
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    // Multiple image keys stored in S3
    imageKeys: {
      type: [String],
      default: [],
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    downloads: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Model = mongoose.model("Model", modelSchema);

export default Model;