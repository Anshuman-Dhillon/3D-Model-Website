import mongoose from "mongoose";

//This is supposed to store everything about the listing, including info 
//about the file of the 3d model, name, description, etc.
export const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    authType: {
      type: String,
      required: true,
      unique: true,
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
  },
  { timestamps: true }
);

const Model = mongoose.model("Model", modelSchema);

export default Model;