import Model from "../models/model.js";
import User from "../models/user.js";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./userHelpers.js";
import authenticated from "../middleware/authentication.js"

// this file holds things that users should be able to do
//CRUD operations for Signed In Users, user interactions with models

//Route: /users/models/addcart/:modelid/:username

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

router.get("/users/models/getallmodels/:username", userGetAllModels);

export async function userGetAllModels(req, res) {
  try {
    const { username } = req.params;

    const user = await User.findOne(
      { "settings.personal_info.username": username },
      { posted_models: 1, _id: 0 }
    ).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's posted models array
    return res.status(200).json(user.posted_models || []);
  } catch (error) {
    console.error("Error fetching models:", error);
    return res.status(500).json({ message: "Error fetching models" });
  }
}

//Route: /users/models/createmodel/:username

export async function userCreateModel(req, res) {
  try {
    const { username } = req.params;
    const { name, description, price } = req.body;

    // Basic validation
    if (!name || !description || price === undefined) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["name", "description", "price"],
      });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: "Invalid price value" });
    }

    // Find user to associate model with
    const user = await User.findOne({ "settings.personal_info.username": username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the model, optionally set user reference if needed
    const newModel = new Model({
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      // user: user._id,   // uncomment if your schema has a user ref
    });

    const savedModel = await newModel.save();

    // Optionally push model to user's posted_models array
    // user.posted_models.push(savedModel);
    // await user.save();

    return res.status(201).json(savedModel);
  } catch (error) {
    console.error("Error creating model:", error);
    return res.status(500).json({ message: "Error creating model" });
  }
}


//Route: /users/models/editmodel/:username/modelId

export async function editModel(req, res) {
  try {
    const { username, id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Model ID is required" });
    }

    // Find user by nested username
    const user = await User.findOne({ "settings.personal_info.username": username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user owns the model
    const ownsModel = user.posted_models.some(
      (modelId) => modelId.toString() === id
    );
    if (!ownsModel) {
      return res.status(403).json({ message: "You do not have permission to edit this model" });
    }

    // Prepare updates, remove id fields if present
    const updates = { ...req.body, ...req.query };
    delete updates.id;
    delete updates._id;

    // Update the model document by id
    const updatedModel = await Model.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedModel) {
      return res.status(404).json({ message: "Model not found" });
    }

    return res.status(200).json(updatedModel);
  } catch (error) {
    console.error("Error editing model:", error);
    return res.status(500).json({ message: "Error editing model" });
  }
}


// Settings
// Route: /users/settings/settings/:username/:currentpassword
export async function personalInfoChange(req, res) {
  try {
    const updates = req.query; // partial updates come from query
    const { username, currentpassword } = req.params;

    // Your schema nests username under settings.personal_info
    const user = await User.findOne({ "settings.personal_info.username": username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const storedHash = user.settings.personal_info.password;
    const passwordMatch = await bcrypt.compare(currentpassword, storedHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    // Handle password change explicitly
    if (updates.password) {
      const newHashed = await bcrypt.hash(updates.password, 10);
      user.settings.personal_info.password = newHashed;
    }

    // Only update keys that already exist in personal_info (excluding password we handled above)
    const allowedKeys = Object.keys(user.settings.personal_info.toObject?.() ?? user.settings.personal_info);
    for (const [key, value] of Object.entries(updates)) {
      if (key === "password") continue;
      if (allowedKeys.includes(key)) {
        user.settings.personal_info[key] = value;
      }
    }

    await user.save();
    return res.status(200).json({ message: "Personal info updated successfully" });
  } catch (error) {
    console.error("Error changing settings:", error);
    return res.status(500).json({ message: "Error changing settings", error: error.message });
  }
}

// Route: /users/settings/notifications/:username/
export async function notificationChange(req, res) {
  try {
    const data = req.query;
    const { username } = req.params;

    const user = await User.findOne({
      "settings.personal_info.username": username,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notifications =
      user.settings.payment_methods.notification_settings;

    const allowedKeys = Object.keys(
      notifications.toObject?.() ?? notifications
    );

    const toBool = (v) => {
      if (typeof v === "boolean") return v;
      if (v === "true" || v === "1") return true;
      if (v === "false" || v === "0") return false;
      return v; // fallback (in case you later add non-boolean fields)
    };

    let touched = 0;
    for (const [key, value] of Object.entries(data)) {
      if (allowedKeys.includes(key)) {
        notifications[key] = toBool(value);
        touched++;
      }
    }

    if (touched === 0) {
      return res
        .status(400)
        .json({ message: "No valid notification fields provided" });
    }

    await user.save();
    return res
      .status(200)
      .json({ message: "Notification settings updated successfully" });
  } catch (error) {
    console.error("Error changing settings:", error);
    return res
      .status(500)
      .json({ message: "Error changing settings", error: error.message });
  }
}


// Route: /users/settings/settings/:username/
export async function getAllCart(req, res) {
  try {
    const { username } = req.params;

    // Correctly find the user by nested username
    const user = await User.findOne(
      { "settings.personal_info.username": username },
      { "orders.items": 1, _id: 0 } // project only items
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the cart items
    return res.status(200).json(user.orders.items);
  } catch (error) {
    console.error("Error retrieving cart:", error);
    return res.status(500).json({ message: "Error retrieving cart" });
  }
}


