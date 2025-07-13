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