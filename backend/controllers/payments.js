import Model from "../models/model.js";
import User from "../models/user.js";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./controllers.js";
import authenticated from "../middleware/authentication.js"

//This file has all the methods related to transactions

//Route: /users/models/addtransaction/:username/:modelid

export async function addTransaction(req, res) {
    try {
        const username = req.params.username;
        const modelId = req.params.modelid;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const model = await Model.findById(modelId);
        if (!model) {
            return res.status(404).json({ message: "Model not found" });
        }

        const transaction = {
            date: new Date(),
            modelName: model.name,
            orderNumber: Date.now().toString(36) + Math.random().toString(36).substr(2),
            price: model.price,
            modelId: model._id,
            sellerId: model.sellerId
        };

        user.transactions.push(transaction);
        await user.save();

        res.status(201).json({ 
            message: "Added transaction", 
            transaction 
        });
    } catch (error) {
        res.status(500).json({ message: "Unable to add transaction", error: error.message });
        console.error("Unable to add transaction", error);
    }
}

//Warning: We may not allow user to do this

//Route: /users/models/removetransaction/:username

export async function removeTransaction(req, res) {
    try {
        const username = req.params.username;
        const transactionId = req.body.transactionId;

        if (!transactionId) {
            return res.status(400).json({ message: "Transaction ID is required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $pull: { transactions: { _id: transactionId } } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ 
            message: "Successfully removed transaction", 
            transactions: updatedUser.transactions 
        });
    } catch (error) {
        res.status(500).json({ message: "Unable to remove transaction", error: error.message });
        console.error("Unable to remove transaction", error);
    }
}

//Transporting the models from seller to buyer

//Route: /users/models/transportmodel/:sellerId/:buyerId/:modelId

export async function transportModel(req, res) {
    try {
        const { sellerId, buyerId, modelId } = req.params;

        const seller = await User.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const buyer = await User.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({ message: "Buyer not found" });
        }

        const model = await Model.findById(modelId);
        if (!model) {
            return res.status(404).json({ message: "Model not found" });
        }

        // Check if the seller owns the model
        if (model.sellerId.toString() !== sellerId) {
            return res.status(403).json({ message: "You do not own this model" });
        }

        // Remove the model from the seller's inventory
        seller.models.pull(modelId);
        await seller.save();

        // Add the model to the buyer's inventory
        buyer.models.push(modelId);
        await buyer.save();

        res.status(200).json({ message: "Model successfully transported", model });
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve model, please try again", error: error.message });
        console.error("Unable to retrieve model, please try again", error);
    }
}