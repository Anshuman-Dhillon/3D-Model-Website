import Model from "../models/model.js";
import User from "../models/user.js";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./controllers.js";
import authenticated from "../middleware/authentication.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from 'jsonwebtoken';


// Load environment variables from .env file
dotenv.config()

// in the form, we have the user name, and password boxes
//Route: /users/google/:username/:email/:password

export async function logInUser(req, res) {
    try {
        
          
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
}