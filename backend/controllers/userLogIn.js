import Model from "../models/model.js";
import User from "../models/user.js";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./controllers.js";
import authenticated from "../middleware/authentication.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

// in the form, we have the user name, and password boxes
//Route: /users/:username/:email/:password

export async function logInUser(req, res) {
    try {
        const userData = req.body;
        const username = userData["username"]
        const email = userData["email"]
        const password = userData["password"]

        //check username
        const userFound = await User.findOne({username: username})
        const emailFound = await User.findOne({email_address: email})

        const user = userFound || emailFound;

        if (!user) {
            throw new Error("Invalid Username or Email.")
        }

        //check password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error("Invalid Password.");
        }
        //log in user if success, otherwise raise the appropriate error

        const payload = { id: user._id, username: user.username };
        //create the token
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_TOKEN, { expiresIn: '1h' });

        //Save the refresh token ig
        user.refreshToken = refreshToken;
        await user.save();
        
        res.status(200).json({
                    message: "Login successful",
                    user: { username: user.name, email: user.email_address },
                    accessToken: accessToken
                });    
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
}