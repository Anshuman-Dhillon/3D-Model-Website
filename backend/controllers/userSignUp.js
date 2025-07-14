import Model from "../models/model.js";
import User from "../models/user.js";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./controllers.js";
import authenticated from "../middleware/authentication.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()
// in the form, we have the user name, password and confirm password boxes
//Route: /users/:username/:password/:confirmpassword

export async function createUser(req, res) {
    try {
        const userData = req.body;
        const email = userData["email"]
        const username = userData["username"]
        const password = userData["password"]
        const confirmPassword = userData["confirmPassword"]

        const saltRounds = process.env.SALT_ROUNDS
        const hashedPassword = await bcrypt.hash(password, saltRounds)


        if (username.length > 50) {
            throw new Error ("Username must be less than 50 characters")
        } else if (username.length < 4) {
            throw new Error ("Username must be more than 4 characters")
        } else if (password !== confirmPassword) {
            throw new Error("Both passwords must be the same")
        } else if (password.length < 1) {
            throw new Error("You didn't fill in the passwords section")
        } else if (password.length > 100) {
            throw new Error("Password too long")
        } else {
            //create the user

            const existingName = await User.findOne({name: username
            })
            const existingEmail = await User.findOne({
                email_address: email
            })
            if (existingName) {
                throw new Error("User with this username already exists!")
            } else if (existingEmail) {
                throw new Error("User with this email already exists!")
            }

            const newUser = new User({
                name: username,
                password: hashedPassword,
                email_address: email
            });

            await newUser.save()
        }
        
        res.status(201).json({ message: "User created successfully", user: { name: username, email_address: email } });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
}