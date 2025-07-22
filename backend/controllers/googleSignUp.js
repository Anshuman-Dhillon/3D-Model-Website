import Model from "../models/model.js";
import User from "../models/user.js";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./controllers.js";
import authenticated from "../middleware/authentication.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()
// in the form, we have the user name, password and confirm password boxes

//Route: /users/google/:username/:password/:confirmpassword

export async function googleSignUpUser(req, res) {
    try {
        
        
        res.status(201).json({ message: "User created successfully", user: { name: username, email_address: email } });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
}