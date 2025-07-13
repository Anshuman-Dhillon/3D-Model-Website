import express from "express"
import { addCart, removeCart, addTransaction, removeTransaction, transportModel } from "../controllers/userFunctions.js";
import { getAllModels, getModelById, createModel, updateModel, deleteModel} from "../controllers/modelFunctions.js"
import {getAllUsers, getUserById, updateUser, deleteUser} from "../controllers/userHelpers.js"
import {createUser, signUpUser} from "../controllers/userSignUp.js"
import { logInUser } from "../controllers/userLogIn.js";


const router = express.Router();

// Model routes
router.get("/models", getAllModels);
router.get("/models/:id", getModelById);

router.post("/models", createModel);

router.put("/models/:id", updateModel);

router.delete("/models/:id", deleteModel);

// User routes for all users (Generic)
router.get("/users", getAllUsers);
router.get("/users/:userid", getUserById);

router.post("/users", createUser);

router.put("/users/:userid", updateUser);

router.delete("/users/:userid", deleteUser);

// Signed in user routes

// Cart related routes
router.get("/users/add/:username", addCart);
router.delete("/users/remove/:id", removeCart);

// transaction related routes
router.get("/users/add/transaction/:username", addTransaction);
router.delete("/users/remove/transaction/:username", removeTransaction);

export default router;