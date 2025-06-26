import mongoose from "mongoose";

const modelSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },

    {timestamps: true}
);

const Model = mongoose.model("Model", modelSchema);

export default Model;