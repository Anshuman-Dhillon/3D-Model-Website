import Model from "../models/model.js";
import User from "../models/user.js";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./controllers.js";
import authenticated from "../middleware/authentication.js"

// this file holds things that users should be able to do
//CRUD operations for Signed In Users, user interactions with models

export async function addCart(req, res) {
    try {
        const userId = req.params.id; // Assuming the user ID is in the URL
        const modelId = req.body.modelId; // Assuming modelId is sent in request body

        // Fetch model
        const model = await Model.findById(modelId);
        if (!model) {
            return res.status(404).json({ message: "Model not found" });
        }

        // Append model to user's cart (e.g., orders.items)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    "orders.items": model,
                },
            },
            { new: true, runValidators: true }
        );

        res.status(201).json({ message: "Added to cart", model: model });
    } catch(error) {
        res.status(500).json({ message: "Unable to add model to cart", error: error.message });
        console.error("Unable to add model to cart", error);
    }
}

export async function removeCart(req, res) {
    try {

        res.status(200).json({ message: "Successfully removed model from Cart" });
    } catch (error) {
        res.status(500).json({ message: "Unable to remove model to cart", error: error.message });
        console.error("Unable to remove model to cart", error);
    }
}

export async function addTransaction(req, res) {
    try {

        res.status(201).json({ message: "Added transaction" });
    } catch (error) {
        res.status(500).json({ message: "Unable to remove model to cart", error: error.message });
        console.error("Unable to remove model to cart", error);
    }
}

//Warning: We may not allow user to do this
export async function removeTransaction(req, res) {
    try {

        res.status(200).json({ message: "Successfully removed model from Cart" });
    } catch (error) {
        res.status(500).json({ message: "Unable to remove transaction", error: error.message });
        console.error("Unable to remove transaction", error);
    }
}

//Transporting the models from seller to buyer
export async function transportModel(req, res) {
    try {

    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve model, please try again", error: error.message });
        console.error("Unable to retrieve model, please try again", error);
    }
}