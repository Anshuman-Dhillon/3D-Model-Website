import Model from "../models/model.js";
import User from "../models/user.js";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./controllers.js";
import authenticated from "../middleware/authentication.js"

// in the form, we have the user name, and password boxes
//Route: /users/:username/:password

export async function logInUser(req, res) {
    try {
        const userData = req.body;
        const username = userData["username"]
        const password = userData["password"]
        const confirmPassword = userData["confirmPassword"]

        //check username

        //check password

        //log in user if success, otherwise raise the appropriate error
        
        res.status(201).json();
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
}