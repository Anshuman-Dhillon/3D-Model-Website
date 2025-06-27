import Model from "../models/model.js";
import User from "../models/user.js";

//Code for CRUD operations on Models
export async function getAllModels(req, res) {
    try {
        const models = await Model.find({});
        res.status(200).json(models);
    } catch (error) {
        console.error("Error fetching models:", error);
        res.status(500).json({ message: "Error fetching models", error: error.message });
    }
}

export async function createModel(req, res) {
    try {
        const name = req.body.name || req.query.name;
        const description = req.body.description || req.query.description;
        const price = req.body.price || req.query.price;

        const newModel = new Model({
            name,
            description,
            price
        });

        const savedModel = await newModel.save();
        res.status(201).json(savedModel);
    } catch (error) {
        console.error("Error creating model:", error);
        res.status(500).json({ message: "Error creating model", error: error.message });
    }
}

export async function getModelById(req, res) {
    const modelId = req.params.id;
    res.status(200).send(`Get model with ID: ${modelId}`);
}

export async function updateModel(req, res) {
    try {
        const name = req.body.name || req.query.name;
        const description = req.body.description || req.query.description;
        const price = req.body.price || req.query.price;;

       const updatedModel = await Model.findByIdAndUpdate(
            req.params.id,
            { name, description, price },
            {new: true, runValidators: true }
        );

        if (!updatedModel) {
            return res.status(404).json({ message: "Model not found" });
        }

        res.status(200).json({ message: "Model updated successfully" });
    } catch (error) {
        console.error("Error updating model:", error);
        res.status(500).json({ message: "Error updating model", error: error.message });
    }
}

export async function deleteModel(req, res) {
    try {
        const deletedModel = await Model.findByIdAndDelete(req.params.id);

        if (!deletedModel) {
            return res.status(404).json({ message: "Model not found" });
        }

        res.status(200).json({ message: "Model deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting model", error: error.message });
        console.error("Error deleting model:", error);
    }
}

//CRUD operations for users
export async function getAllUsers(req, res) {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
}

export async function createUser(req, res) {
    try {
        const userData = req.body;
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        
        res.status(201).json(savedUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
}

export async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
}

export async function updateUser(req, res) {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
}

export async function deleteUser(req, res) {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
        console.error("Error deleting user:", error);
    }
}

//CRUD operations for user interactions with models
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