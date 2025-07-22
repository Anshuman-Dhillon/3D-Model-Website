import express from "express"
import { addCart, removeCart, editModel, userCreateModel, userGetAllModels } from "../controllers/userFunctions.js";
import { addTransaction, removeTransaction, transportModel } from "../controllers/payments.js";
import { getAllModels, getModelById, createModel, updateModel, deleteModel} from "../controllers/modelFunctions.js"
import {getAllUsers, getUserById, updateUser, deleteUser} from "../controllers/userHelpers.js"
import {createUser} from "../controllers/userSignUp.js"
import { logInUser } from "../controllers/userLogIn.js";
import { authenticated } from "../middleware/authentication.js";
import { googleLogInUser } from "../controllers/googleLogIn.js";
import { googleSignUpUser } from "../controllers/googleSignUp.js";

const router = express.Router();
router.use(authenticated); //set up authenticated middleware for all routes

// Model routes
router.get("/models", getAllModels);
router.get("/models/:id", getModelById);

router.post("/models", createModel);

router.put("/models/:id", updateModel);

router.delete("/models/:id", deleteModel);

// User routes for all users (Generic)
router.get("/users", getAllUsers);
router.get("/users/:username", getUserById);

//Sign Up user
router.post("/users", createUser);

//Log In user
router.post("/users/:username/:email/:password", logInUser)

//Update User info
router.put("/users/:username/:password/:confirmpassword", updateUser);

//delete user
router.delete("/users/:userid", deleteUser);

// Signed in user routes

// Cart related routes
router.get("/users/add/:modelid/:username", addCart);
router.delete("/users/remove/:modelid/:username", removeCart);

// transaction related routes
router.get("/users/add/transaction/:username", addTransaction);
router.delete("/users/remove/transaction/:username", removeTransaction);

// Payment and Transaction routes
router.post("/transactions/create/:username/:modelid", addTransaction);
router.delete("/transactions/remove/:username/:transactionId", removeTransaction);
router.post("/transactions/transport-model", transportModel);

router.get("/users/models/editmodel/:username", editModel)
router.get("/users/models/createmodel/:username", userCreateModel)
router.get("/users/models/getallmodels/:username", userGetAllModels)

export default router;