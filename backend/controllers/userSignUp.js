import Model from "../models/model.js";
import User from "../models/user.js";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./controllers.js";
import authenticated from "../middleware/authentication.js"

// in the form, we have the user name, password and confirm password boxes
//Route: /users/:username/:password/:confirmpassword

export async function createUser(req, res) {
    try {
        const userData = req.body;
        const username = userData["username"]
        const password = userData["password"]
        const confirmPassword = userData["confirmPassword"]

        if (username.length > 50) {
            throw new Error ("Password must be less than 50 characters")
        } if (username.length < 4) {
            throw new Error ("Password must be more than 4 characters")
        } else if (password != confirmPassword) {
            throw new Error("Both passwords must be the same")
        } else if (password.length < 1) {
            throw new Error("You didn't fill in the passwords section")
        } else {
            //create the user

        }
        
        res.status(201).json();
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
}