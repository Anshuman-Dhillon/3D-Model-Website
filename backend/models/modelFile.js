import mongoose, { Mongoose } from "mongoose";

//hold the info about the 3d model file

export const modelFileSchema = new mongoose.Schema(
    {}, 
    { timestamps: true }
)

const modelFile = mongoose.model("modelFile", modelFileSchema);

export default modelFile;