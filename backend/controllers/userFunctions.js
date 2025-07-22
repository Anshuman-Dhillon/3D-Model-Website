import Model from "../models/model.js";
import User from "../models/user.js";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./controllers.js";
import authenticated from "../middleware/authentication.js"

// this file holds things that users should be able to do
//CRUD operations for Signed In Users, user interactions with models

//Route: /users/models/addCart/:modelid/:username

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

//Route: /users/models/removecart/:modelid/:username

export async function removeCart(req, res) {
    try {
        const userId = req.params.id;
        const modelId = req.params.modelId;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    "orders.items": { _id: modelId }
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Successfully removed model from cart" });
    } catch (error) {
        console.error("Error removing model from cart:", error);
        res.status(500).json({ message: "Unable to remove model from cart", error: error.message });
    }
}

//Code for CRUD operations on Models

//Route: /users/models/getallmodels/:username

export async function userGetAllModels(req, res) {
    try {
        const models = await Model.find({});
        res.status(200).json(models);
    } catch (error) {
        console.error("Error fetching models:", error);
        res.status(500).json({ message: "Error fetching models", error: error.message });
    }
}

//Route: /users/models/createmodel/:username
export async function userCreateModel(req, res) {
    try {
        const name = req.body.name || req.query.name;
        const description = req.body.description || req.query.description;
        const price = req.body.price || req.query.price;

        // Input validation
        if (!name || !description || !price) {
            return res.status(400).json({ 
                message: "Missing required fields", 
                required: ["name", "description", "price"] 
            });
        }

        if (isNaN(price) || price < 0) {
            return res.status(400).json({ message: "Invalid price value" });
        }

        const newModel = new Model({
            name,
            description,
            price: Number(price)
        });

        const savedModel = await newModel.save();
        res.status(201).json(savedModel);
    } catch (error) {
        console.error("Error creating model:", error);
        res.status(500).json({ message: "Error creating model", error: error.message });
    }
}

//Route: /users/models/editmodel/:username/modelId

export async function editModel(req, res) {
    try {
        const id = req.params.id || req.body.id || req.query.id;
        if (!id) {
            return res.status(400).json({ message: "Model ID is required" });
        }

        const updates = {
            ...req.query,
            ...req.body,
        };

        // Optionally remove `id` from updates if it exists
        delete updates.id;
        delete updates._id;

        const updatedModel = await Model.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedModel) {
            return res.status(404).json({ message: "Model not found" });
        }

        res.status(200).json(updatedModel);
    } catch (error) {
        console.error("Error editing model:", error);
        res.status(500).json({ message: "Error editing model", error: error.message });
    }
}


// Settings
// Route: /users/settings/settings/:username/:currentpassword
export async function personalInfoChange(req, res) {
    try {
        const data = req.query;
        const { username, currentpassword } = req.params;

        const user = await User.findOne({ "username": username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(currentpassword, user.settings.personal_info.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect current password" });
        }

        // If updating password, hash the new password
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        for (const key in data) {
            if (key in user.settings.personal_info) {
                user.settings.personal_info[key] = data[key];
            }
        }

        await user.save();
        res.status(200).json({ message: "Personal info updated successfully" });
    } catch (error) {
        console.error("Error changing settings:", error);
        res.status(500).json({ message: "Error changing settings", error: error.message });
    }
}


// Route: /users/settings/settings/:username/
export async function notificationChange(req, res) {
    try {
        const data = req.query;
        const user = await User.findOne({"username": req.params.username});
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        for (const key in data) {
            if (key in user.settings.notification_settings) {
                user.settings.notification_settings[key] = data[key];
            }
        }
        
        await user.save();
        res.status(200).json({ message: "Notification settings updated successfully" });
    } catch (error) {
        console.error("Error changing settings:", error);
        res.status(500).json({ message: "Error changing settings", error: error.message });
    }
}


// Route: /users/settings/settings/:username/
export async function getAllCart(req, res) {
    try {
        const { username } = req.params;

        const user = await User.findOne({ "settings.personal_info.username": username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const cart = user.orders.items;

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error retrieving cart:", error);
        res.status(500).json({ message: "Error retrieving cart", error: error.message });
    }
}

