import mongoose, { Mongoose } from "mongoose";

//hold the info about each transaction, no matter what platform

export const transactionSchema = new mongoose.Schema(
    {
        
    }, 
    { timestamps: true }
)

const modelFile = mongoose.model("transaction", transactionSchema);
export default modelFile;