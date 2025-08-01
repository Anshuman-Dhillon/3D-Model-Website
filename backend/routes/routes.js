import express from "express"
import { addCart, removeCart, editModel, userCreateModel, userGetAllModels, personalInfoChange, notificationChange, getAllCart } from "../controllers/userFunctions.js";
import { addTransaction, removeTransaction, transportModel } from "../controllers/payments.js";
import { getAllModels, getModelById, createModel, updateModel, deleteModel} from "../controllers/modelFunctions.js"
import {getAllUsers, getUserById, updateUser, deleteUser} from "../controllers/userHelpers.js"
import {createUser} from "../controllers/userSignUp.js"
import { logInUser } from "../controllers/userLogIn.js";
import authenticated from "../middleware/authentication.js";
import { googleLogInUser } from "../controllers/googleLogIn.js";
import { googleSignUpUser } from "../controllers/googleSignUp.js";

const router = express.Router();


// Model routes
router.get("/models/getallmodels", getAllModels);
router.get("/models/getmodelbyid/:id", getModelById);

router.post("/models/createmodel/:name/:description/:price", createModel);

router.put("/models/updatemodel/:id", updateModel);

router.delete("/models/deletemodel/:id", deleteModel);

// User routes for all users (Generic)
router.get("/users/getallusers", getAllUsers);
router.get("/users/getuserbyid/:username", getUserById);

// Sign Up user
router.post("/users/signup", createUser);


//Log In user
router.post("/users/login", logInUser);

router.use(authenticated); //set up authenticated middleware for all routes

//Update User info
router.put("/users/update/:username/:password/:confirmpassword", updateUser);

//delete user
router.delete("/users/delete/:userid", deleteUser);

// Signed in user routes

// Cart related routes
router.post("/users/add/:modelid/:username", addCart);
router.delete("/users/remove/:modelid/:username", removeCart);

router.get("/users/getallcart/:username", getAllCart);

// transaction related routes
router.get("/users/add/transaction/:username", addTransaction);
router.delete("/users/remove/transaction/:username", removeTransaction);

// Payment and Transaction routes
router.post("/transactions/create/:username/:modelid", addTransaction);
router.delete("/transactions/remove/:username/:transactionId", removeTransaction);
router.post("/transactions/transport-model", transportModel);

router.patch("/users/models/editmodel/:username/:id", editModel);
router.post("/users/models/createmodel/:username", userCreateModel);
router.get("/users/models/getallmodels/:username", userGetAllModels);

//settings routes for users
router.patch("/users/settings/settings/:username/:currentpassword", personalInfoChange);
router.patch("/users/settings/notifications/:username", notificationChange);

export default router;